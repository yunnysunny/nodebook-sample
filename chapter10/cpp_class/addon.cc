#include <nan.h>
#include "MyCalc.h"

using namespace v8;

void InitAll(v8::Local<v8::Object> exports) {
    MyCalc::Init(exports);
}

NODE_MODULE(mycalc, InitAll)