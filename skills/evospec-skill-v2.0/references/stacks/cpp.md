---
stack_id: cpp
language: cpp
secondary_languages: [c]
framework: native
build_system: cmake_make
build_command: "cmake --build build"
test_command: "ctest --test-dir build"
---

# C/C++ 通用技术栈规则

## 架构风格

```
推荐架构: 分层架构

组件：
├── Presentation: 展示层（CLI/GUI）
├── Business: 业务逻辑层
├── Data: 数据访问层
├── Infrastructure: 基础设施层
└── Common: 公共模块
```

## 命名规范

```
文件命名：
├── 类: PascalCase.cpp / PascalCase.h
├── 模板: PascalCase.tpp / PascalCase.hpp
├── 接口: I{功能}.h
└── 实现: {类名}Impl.cpp

类命名：
├── 类: PascalCase
├── 接口: I前缀 (如: IDataReader)
├── 抽象类: Abstract前缀 或 Base后缀
├── 异常: Exception后缀
└── 工厂: Factory后缀

变量命名：
├── 成员变量: m_{name} 或 _{name}
├── 静态变量: s_{name}
├── 常量: k{ConstantName}
├── 枚举值: k{EnumName}{Value}
└── 局部变量: snake_case 或 camelCase

函数命名：
├── 普通函数: snake_case 或 camelCase
├── getter: get{PropertyName}()
├── setter: set{PropertyName}()
└── 工厂方法: create{ProductName}()
```

## 代码模式

```
RAII模式：
class Resource {
public:
    Resource() : handle_(acquire()) {}
    ~Resource() { if (handle_) release(handle_); }
    
    // 禁止拷贝，允许移动
    Resource(const Resource&) = delete;
    Resource& operator=(const Resource&) = delete;
    Resource(Resource&& other) noexcept : handle_(other.handle_) {
        other.handle_ = nullptr;
    }
    
private:
    Handle* handle_;
};

PIMPL模式：
// Widget.h
class Widget {
public:
    Widget();
    ~Widget();
private:
    class Impl;
    std::unique_ptr<Impl> pImpl_;
};

// Widget.cpp
class Widget::Impl {
    // 实现细节
};

智能指针使用：
├── 独占所有权: std::unique_ptr
├── 共享所有权: std::shared_ptr
├── 弱引用: std::weak_ptr
└── 原始指针: 仅观察，不管理生命周期
```

## 目录结构

```
project/
├── src/
│   ├── core/               # 核心模块
│   ├── app/                # 应用入口
│   └── modules/            # 功能模块
├── include/
│   └── {project}/          # 公开头文件
├── lib/                    # 第三方库
├── tests/
│   ├── unit/
│   └── integration/
├── docs/
├── cmake/
│   └── modules/
├── CMakeLists.txt
└── README.md
```

## 错误处理模式

```
返回值模式：
// 使用std::expected (C++23) 或 Result类型
template<typename T, typename E = std::string>
class Result {
    std::variant<T, E> value_;
public:
    bool is_ok() const { return std::holds_alternative<T>(value_); }
    T& unwrap() & { return std::get<T>(value_); }
    const E& error() const { return std::get<E>(value_); }
};

异常使用规范：
├── 构造函数失败: 抛异常
├── 不可恢复错误: 抛异常
├── 可恢复错误: 返回Result/optional
└── 边界条件: 断言（仅Debug）

错误码规范：
├── 0: 成功
├── 正数: 部分成功/警告
└── 负数: 错误
```

## 测试规范

```
测试框架：
├── Google Test (gtest)
├── Catch2
└── doctest

测试命名：
├── 测试文件: {module}_test.cpp
├── 测试套件: {ClassName}Test
├── 测试用例: {method}_{scenario}
└── 示例: TEST(WeatherService, GetData_ValidInput_ReturnsData)

Mock框架：
├── Google Mock (gmock)
├── FakeIt
└── 手写Stub

覆盖率：
├── 行覆盖率
├── 分支覆盖率
└── 工具: gcov / lcov
```

## 常见编译错误与修复

| 错误类型 | 常见原因 | 修复方式 |
|---------|---------|---------|
| Undefined reference | 链接顺序/缺失源文件 | 调整CMakeLists.txt |
| Segmentation fault | 空指针/越界 | 添加检查/使用智能指针 |
| Memory leak | 未释放内存 | 使用RAII/智能指针 |
| Header not found | 包含路径错误 | 更新include_directories |
| Multiple definition | 重复定义 | 使用include guards/pragma once |

## 构建检查

```bash
# CMake配置
cmake -B build -DCMAKE_BUILD_TYPE=Debug

# 编译
cmake --build build

# 测试
ctest --test-dir build --output-on-failure

# 静态分析
cppcheck --enable=all src/

# 内存检查
valgrind --leak-check=full ./build/app
```

## C++版本选择

```
推荐版本: C++17 或 C++20

特性使用：
├── C++11: auto, lambda, move语义, smart_ptr
├── C++14: 泛型lambda, 返回类型推导
├── C++17: optional, variant, string_view, if constexpr
├── C++20: concepts, ranges, coroutines
└── C++23: expected, module (慎用)

资源受限/车载限制：
├── 禁用RTTI（-fno-rtti）
├── 禁用异常（-fno-exceptions）→ 使用Result类型
├── 禁用动态链接 → 静态链接
└── 限制STL使用 → 自定义容器
```