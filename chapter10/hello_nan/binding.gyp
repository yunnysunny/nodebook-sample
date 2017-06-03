{
  "targets": [
    {
      "target_name": "hello_nan",
      "sources": [ "hello.cc" ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}