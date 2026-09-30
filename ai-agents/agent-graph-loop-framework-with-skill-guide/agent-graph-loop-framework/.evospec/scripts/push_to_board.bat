@echo off
setlocal
where python >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Python 3 not found in PATH.
  exit /b 2
)
python "%~dp0deploy_from_config.py" %*
exit /b %errorlevel%
