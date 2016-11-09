$ = require 'jquery'

do fill = (item = 'Live reloading is cool') ->
  $('.tagline').append "#{item}"
fill