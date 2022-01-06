#include <nan.h>
#include "MyCalc.h"

using namespace v8;

void InitAll(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
    MyCalc::Init(module);
}

NODE_MODULE(mycalc, InitAll)