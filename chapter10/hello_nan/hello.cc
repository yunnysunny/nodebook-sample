// hello.cc
#include <nan.h>

using namespace v8;

NAN_METHOD(Method) {
  info.GetReturnValue().Set(Nan::New<String>("world").ToLocalChecked());
}

NAN_MODULE_INIT (Init) {
  Nan::Export(target, "hello", Method);
}

NODE_MODULE(hello_nan, Init)