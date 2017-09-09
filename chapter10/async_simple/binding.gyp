{
  'targets': [
    {
      'target_name': 'async-simple',
      'defines': [
        'DEFINE_FOO',
        'DEFINE_A_VALUE=value',
      ],
      "include_dirs" : [
            "<!(node -e \"require('nan')\")"
      ],
      'conditions' : [
            ['OS=="linux"', {
              'defines': [
                'LINUX_DEFINE',
              ],
              
              'libraries':[
                  '-lpthread'
              ],
              'sources': [ 'async_simple.cc' ]
            }],
            ['OS=="win"', {
              'defines': [
                'WINDOWS_SPECIFIC_DEFINE',
              ],
              'sources': [ 'async_simple.cc' ]
            }]
        ]
      
    }
  ]
}