#!/usr/bin/env bash
# Edit this file for the real project. Environment variables override defaults.
# Keep these wrappers consistent with .evospec/module.config.yaml build/environment settings.

PROJECT_BUILD_CMD="${PROJECT_BUILD_CMD:-}"
PROJECT_TEST_CMD="${PROJECT_TEST_CMD:-}"
PROJECT_LINT_CMD="${PROJECT_LINT_CMD:-}"

# Examples:
# PROJECT_BUILD_CMD="cmake -S . -B build && cmake --build build --parallel"
# PROJECT_TEST_CMD="ctest --test-dir build --output-on-failure"
# PROJECT_LINT_CMD="clang-tidy src/*.c -- -Iinclude"
