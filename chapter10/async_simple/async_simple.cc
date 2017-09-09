#include <string>
#include <nan.h>
#include <sstream>

#ifdef WINDOWS_SPECIFIC_DEFINE
#include <windows.h>
typedef DWORD ThreadId;
#else
#include <unistd.h>
#include <pthread.h>
typedef unsigned int ThreadId;
#endif
using v8::Function;
using v8::FunctionTemplate;
using v8::Local;
using v8::Value;
using v8::String;

using Nan::AsyncQueueWorker;
using Nan::AsyncWorker;
using Nan::Callback;
using Nan::HandleScope;
using Nan::New;
using Nan::Null;
using Nan::ThrowError;
using Nan::Set;
using Nan::GetFunction;

NAN_METHOD(doAsyncWork);


static ThreadId __getThreadId() {
    ThreadId nThreadID;
#ifdef WINDOWS_SPECIFIC_DEFINE
    
    nThreadID = GetCurrentProcessId();
    nThreadID = (nThreadID << 16) + GetCurrentThreadId();
#else
    nThreadID = getpid();
    nThreadID = (nThreadID << 16) + pthread_self();
#endif
    return nThreadID;
}

static void __tsleep(unsigned int millisecond) {
#ifdef WINDOWS_SPECIFIC_DEFINE
    ::Sleep(millisecond);
#else
    usleep(millisecond*1000);
#endif
}


class ThreadWoker : public AsyncWorker {
    private:
        std::string str;
    public:
        ThreadWoker(Callback *callback,std::string str)
            : AsyncWorker(callback), str(str) {}
        ~ThreadWoker() {}
        void Execute() {
            ThreadId tid = __getThreadId();
            printf("[%s]: Thread in uv_worker: %d\n",__FUNCTION__,tid);

            __tsleep(1000);
            printf("sleep 1 seconds in uv_work\n");
            std::stringstream ss;
            ss << " worker function: ";
            ss << __FUNCTION__;
            ss << " worker thread id ";
            ss << tid;
            str += ss.str();
        }
        void HandleOKCallback () {
            HandleScope scope;

            Local<Value> argv[] = {
                Null(),
                Nan::New<String>("the result:"+str).ToLocalChecked()
            };

            callback->Call(2, argv);
        };
};


NAN_METHOD(doAsyncWork) {
    printf("[%s]: Thread id in V8: %d\n",__FUNCTION__,__getThreadId());
    if(info.Length() < 2) { 
        ThrowError("Wrong number of arguments"); 
        return info.GetReturnValue().Set(Nan::Undefined());
    }
  
  
    if (!info[0]->IsString() || !info[1]->IsFunction()) {
        ThrowError("Wrong number of arguments");
        return info.GetReturnValue().Set(Nan::Undefined());
    }
    
    //
    Callback *callback = new Callback(info[1].As<Function>());
    Nan::Utf8String param1(info[0]);
    std::string str = std::string(*param1); 
    AsyncQueueWorker(new ThreadWoker(callback, str));
    info.GetReturnValue().Set(Nan::Undefined());
}

NAN_MODULE_INIT(InitAll) {

  Set(target, New<String>("doAsyncWork").ToLocalChecked(),
    GetFunction(New<FunctionTemplate>(doAsyncWork)).ToLocalChecked());
}

NODE_MODULE(binding, InitAll)
