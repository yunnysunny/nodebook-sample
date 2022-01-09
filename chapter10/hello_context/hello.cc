#include <node.h>

using namespace v8;

class AddonData {
 public:
  explicit AddonData(Isolate* isolate):
      call_count(0) {
    // 确保在环境清理时删除此每个插件实例的数据。
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  // 每个插件的数据。
  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

static void Method(const v8::FunctionCallbackInfo<v8::Value>& info) {
  // 检索每个插件实例的数据。
  AddonData* data =
      reinterpret_cast<AddonData*>(info.Data().As<External>()->Value());
  data->call_count++;
  info.GetReturnValue().Set((double)data->call_count);
}

// 将此插件初始化为上下文感知。
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  // 为该插件实例创建新的 `AddonData` 实例，
  // 并将其生命周期与 Node.js 环境的生命周期联系起来。
  AddonData* data = new AddonData(isolate);

  // 将数据包装在 `v8::External` 中，
  // 以便可以将其传给暴露的方法。
  Local<External> external = External::New(isolate, data);

  // 将方法 `Method` 暴露给 JavaScript，
  // 并通过将 `external` 作为第三个参数传给 `FunctionTemplate` 构造函数
  // 来确保它接收到上面创建的每个插件实例的数据。
  exports->Set(context,
               String::NewFromUtf8(isolate, "method").ToLocalChecked(),
               FunctionTemplate::New(isolate, Method, external)
                  ->GetFunction(context).ToLocalChecked()).FromJust();
}