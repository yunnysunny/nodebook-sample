#ifndef MY_CALC_H
#define MY_CALC_H

#include <nan.h>

class MyCalc : public Nan::ObjectWrap {
public:
    static void Init(v8::Local<v8::Object> module);
private:
    explicit MyCalc(double value=0);
    ~MyCalc();

    static NAN_METHOD(New);
    static NAN_METHOD(PlusOne);
    static NAN_METHOD(GetValue);
    static Nan::Persistent<v8::Function> constructor;
    double _value;
};

#endif