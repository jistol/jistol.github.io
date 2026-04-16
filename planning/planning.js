const preset = {
  'name': '월요일',
  'plans': [
    { 'name': '구몬', 'startAt' : '06:00', 'endAt' : '06:30' },
    { 'name': '씻기', 'startAt' : '06:30', 'endAt' : '07:10' }
  ]
};

Cookies.set('preset1', encodeURIComponent(JSON.stringify(preset)))
Cookies.set('dummy', "teset")



var data = JSON.parse(decodeURIComponent(Cookies.get('preset1')))

