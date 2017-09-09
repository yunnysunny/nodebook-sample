{
  "targets": [
    {
      "target_name": "mycalc",
      "sources": [ "addon.cc", "MyCalc.cc" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}