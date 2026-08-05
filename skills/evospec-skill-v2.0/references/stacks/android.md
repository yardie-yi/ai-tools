---
stack_id: android
language: kotlin
secondary_languages: [java]
framework: android
build_system: gradle
build_command: "./gradlew assembleDebug"
test_command: "./gradlew test"
---

# Android 技术栈规则

## 架构风格

```
推荐架构: MVVM + Clean Architecture

组件：
├── View: Activity/Fragment + ViewBinding
├── ViewModel: Jetpack ViewModel + LiveData/StateFlow
├── Repository: 数据仓库层
├── DataSource: 本地/远程数据源
└── DI: Hilt/Koin
```

## 命名规范

```
类命名：
├── Activity: {功能}Activity (如: MainActivity)
├── Fragment: {功能}Fragment (如: WeatherFragment)
├── ViewModel: {功能}VM 或 {功能}ViewModel
├── Repository: {功能}Repository
├── Adapter: {功能}Adapter
└── 接口: I{功能} (可选)

变量命名：
├── 私有变量: _前缀 (如: _state)
├── 常量: UPPER_SNAKE_CASE
└── 其他: camelCase
```

## 代码模式

```
LiveData模式：
private val _state = MutableLiveData<UiState>()
val state: LiveData<UiState> = _state

协程模式：
viewModelScope.launch {
    repository.getData()
}

依赖注入：
@Inject lateinit var repository: WeatherRepository
```

## 目录结构

```
app/src/main/java/com/{company}/{app}/
├── ui/                    # UI层
│   ├── {feature}/
│   │   ├── {Feature}Fragment.kt
│   │   ├── {Feature}VM.kt
│   │   └── {Feature}Adapter.kt
├── data/                  # 数据层
│   ├── repository/
│   ├── local/
│   └── remote/
├── domain/                # 领域层（可选）
├── di/                    # 依赖注入
└── util/                  # 工具类
```

## 错误处理模式

```
Result模式（推荐）：
sealed class Result<T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error<T>(val message: String, val code: Int? = null) : Result<T>()
}

使用示例：
suspend fun getWeather(cityId: String): Result<WeatherData> {
    return try {
        val response = api.getWeather(cityId)
        Result.Success(response.toDomain())
    } catch (e: HttpException) {
        Result.Error("网络错误", e.code())
    } catch (e: Exception) {
        Result.Error("未知错误")
    }
}

异常处理：
├── 网络异常: HttpException, SocketTimeoutException
├── 数据异常: JsonParseException, NullPointerException
├── 业务异常: 自定义BusinessException
└── 展示错误: Toast / Snackbar / ErrorView
```

## 测试规范

```
测试框架：
├── 单元测试: JUnit4 + MockK
├── UI测试: Espresso
└── 集成测试: AndroidJUnitRunner

Mock策略：
├── 使用MockK而非Mockito（Kotlin友好）
├── relaxUnitFunctions = true（宽松Mock）
├── 示例：mockk<WeatherRepository>()

测试命名：
├── 测试类: {被测类}Test (如: WeatherVMTest)
├── 测试方法: given_{条件}_when_{动作}_then_{结果}
├── 示例: given_validCity_when_getWeather_then_returnsSuccess()

断言库：
├── 推荐: assertJ-Kotlin 或 KotlinTest
├── 示例: assertThat(result).isInstanceOf<Result.Success>()
```

## 常见编译错误与修复

| 错误类型 | 常见原因 | 修复方式 |
|---------|---------|---------|
| Unresolved reference | 缺少import或依赖 | 添加import/检查build.gradle |
| Type mismatch | 类型不匹配 | 检查泛型/转换类型 |
| Nullability | Nullable类型处理 | 添加?或!!或let |
| CoroutineScope | Scope未定义 | 使用viewModelScope/lifecycleScope |
| Hilt injection | @Inject未配置 | 添加@Module/@Provides |

## 构建检查

```bash
# 编译检查
./gradlew assembleDebug

# 测试检查
./gradlew test

# 静态检查（可选）
./gradlew lint
```