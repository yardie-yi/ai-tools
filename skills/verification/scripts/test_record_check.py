"""Exercise the public CLI using real child processes and temporary files."""

import hashlib
import json
import os
from pathlib import Path
import signal
import stat
import subprocess
import sys
import tempfile
import time
import unittest


SCRIPT = Path(__file__).with_name("record_check.py")


class RecordCheckTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.work = self.root / "work"
        self.work.mkdir()
        self.out = self.root / "evidence"

    def command(self, code, *extra, inputs=()):
        argv = [sys.executable, str(SCRIPT), "--out", str(self.out),
                "--cwd", str(self.work)]
        for path in inputs:
            argv += ["--input", str(path)]
        return argv + ["--", sys.executable, "-c", code, *extra]

    def run_check(self, code, *extra, inputs=()):
        return subprocess.run(self.command(code, *extra, inputs=inputs),
                              capture_output=True, text=True, timeout=15)

    def result(self):
        return json.loads((self.out / "result.json").read_text())

    def test_success_records_actual_outputs_and_metadata(self):
        result = self.run_check("import os,sys; print(os.getcwd()); print('warning',file=sys.stderr)")
        self.assertEqual(result.returncode, 0, result.stderr)
        record = self.result()
        self.assertEqual(record["outcome"], "command_succeeded")
        self.assertEqual(record["returncode"], 0)
        self.assertEqual(record["cwd"], str(self.work))
        self.assertEqual((self.out / "stdout.log").read_text(), str(self.work) + "\n")
        self.assertEqual((self.out / "stderr.log").read_text(), "warning\n")
        self.assertGreaterEqual(record["ended_at_utc"], record["started_at_utc"])
        self.assertTrue(record["started_at_utc"].endswith("+00:00"))
        self.assertGreaterEqual(record["elapsed_seconds"], 0)
        self.assertEqual(record["inputs_before"], [])
        self.assertNotIn("environment", record)

    def test_nonzero_is_preserved_with_evidence(self):
        result = self.run_check("import sys; print('failure detail',file=sys.stderr); sys.exit(7)")
        self.assertEqual(result.returncode, 7)
        self.assertEqual(self.result()["returncode"], 7)
        self.assertEqual(self.result()["outcome"], "command_failed")
        self.assertIn("failure detail", (self.out / "stderr.log").read_text())

    def test_missing_executable_records_launch_error(self):
        argv = self.command("unused")
        argv = argv[:argv.index("--") + 1] + [str(self.root / "absent-command")]
        result = subprocess.run(argv, capture_output=True, timeout=10)
        self.assertEqual(result.returncode, 127)
        self.assertEqual(self.result()["outcome"], "launch_error")
        self.assertIsNone(self.result()["returncode"])
        self.assertEqual((self.out / "stdout.log").read_bytes(), b"")

    def test_missing_input_rejects_before_command_or_output_creation(self):
        result = self.run_check("from pathlib import Path; Path('ran').touch()", inputs=["absent"])
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse((self.work / "ran").exists())
        self.assertFalse(self.out.exists())

    def test_existing_output_is_not_overwritten_or_executed(self):
        self.out.mkdir()
        (self.out / "result.json").write_text("original")
        result = self.run_check("from pathlib import Path; Path('ran').touch()")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual((self.out / "result.json").read_text(), "original")
        self.assertFalse((self.work / "ran").exists())

    def test_argv_is_literal_and_not_shell_interpreted(self):
        literal = "$(touch injected); echo wrong > injected"
        result = self.run_check("import sys; print(sys.argv[1])", literal)
        self.assertEqual(result.returncode, 0)
        self.assertEqual((self.out / "stdout.log").read_text(), literal + "\n")
        self.assertEqual(self.result()["argv"][-1], literal)
        self.assertFalse((self.work / "injected").exists())

    def test_input_changes_are_visible_in_both_fingerprints(self):
        (self.work / "input.txt").write_bytes(b"before")
        result = self.run_check("from pathlib import Path; Path('input.txt').write_bytes(b'after')",
                                inputs=["input.txt"])
        self.assertEqual(result.returncode, 0)
        record = self.result()
        self.assertEqual(record["inputs_before"][0]["sha256"], hashlib.sha256(b"before").hexdigest())
        self.assertEqual(record["inputs_after"][0]["sha256"], hashlib.sha256(b"after").hexdigest())

    def test_removed_input_is_recorded_without_losing_command_result(self):
        (self.work / "input.txt").write_text("remove me")
        result = self.run_check("from pathlib import Path; Path('input.txt').unlink()", inputs=["input.txt"])
        self.assertEqual(result.returncode, 0)
        self.assertIsNone(self.result()["inputs_after"][0]["sha256"])
        self.assertIn("error", self.result()["inputs_after"][0])

    @unittest.skipUnless(os.name == "posix", "POSIX symlinks")
    def test_input_symlink_retargeting_is_visible(self):
        (self.work / "old").write_bytes(b"old")
        (self.work / "new").write_bytes(b"new")
        (self.work / "input").symlink_to("old")
        result = self.run_check("from pathlib import Path; p=Path('input'); p.unlink(); p.symlink_to('new')",
                                inputs=["input"])
        self.assertEqual(result.returncode, 0)
        record = self.result()
        self.assertEqual(record["inputs_before"][0]["sha256"], hashlib.sha256(b"old").hexdigest())
        self.assertEqual(record["inputs_after"][0]["sha256"], hashlib.sha256(b"new").hexdigest())

    @unittest.skipUnless(os.name == "posix", "POSIX FIFO")
    def test_special_file_input_is_rejected_without_opening(self):
        os.mkfifo(self.work / "fifo")
        result = self.run_check("from pathlib import Path; Path('ran').touch()", inputs=["fifo"])
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse((self.work / "ran").exists())
        self.assertFalse(self.out.exists())

    def test_large_binary_logs_are_complete_and_hashes_detect_change(self):
        result = self.run_check("import sys; sys.stdout.buffer.write(b'A\\x00'*1500000); "
                                "sys.stderr.buffer.write(b'B'*1200000)")
        self.assertEqual(result.returncode, 0)
        record = self.result()
        for key, data in [("stdout", b"A\x00" * 1500000), ("stderr", b"B" * 1200000)]:
            path = self.out / (key + ".log")
            self.assertEqual(path.read_bytes(), data)
            self.assertEqual(record["logs"][key]["sha256"], hashlib.sha256(data).hexdigest())
            self.assertEqual(record["logs"][key]["size_bytes"], len(data))
        (self.out / "stdout.log").write_text("changed")
        self.assertNotEqual(record["logs"]["stdout"]["sha256"], hashlib.sha256(b"changed").hexdigest())

    @unittest.skipUnless(os.name == "posix", "POSIX permission modes")
    def test_evidence_directory_and_files_are_private(self):
        self.assertEqual(self.run_check("print('ok')").returncode, 0)
        self.assertEqual(stat.S_IMODE(self.out.stat().st_mode) & 0o077, 0)
        for file in self.out.iterdir():
            self.assertEqual(stat.S_IMODE(file.stat().st_mode) & 0o077, 0)

    @unittest.skipUnless(os.name == "posix", "POSIX signal handling")
    def test_interrupt_records_failure_and_stops_direct_child(self):
        code = "from pathlib import Path; import os,time; Path('pid').write_text(str(os.getpid())); time.sleep(30)"
        process = subprocess.Popen(self.command(code), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        try:
            deadline = time.monotonic() + 5
            while not (self.work / "pid").exists() and time.monotonic() < deadline:
                time.sleep(0.02)
            self.assertTrue((self.work / "pid").exists())
            child = int((self.work / "pid").read_text())
            process.send_signal(signal.SIGINT)
            process.communicate(timeout=8)
            self.assertEqual(process.returncode, 130)
            self.assertTrue(self.result()["interrupted"])
            self.assertEqual(self.result()["outcome"], "command_failed")
            with self.assertRaises(ProcessLookupError):
                os.kill(child, 0)
        finally:
            if process.poll() is None:
                process.kill()
                process.communicate()


if __name__ == "__main__":
    unittest.main()
