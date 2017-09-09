#include <nan.h>
#include "MyCalc.h"

using namespace v8;

void InitAll(Handle<Object> exports, Handle<Object> module) {
    MyCalc::Init(module);
}

NODE_MODULE(mycalc, InitAll)