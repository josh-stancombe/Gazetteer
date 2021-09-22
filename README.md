# Gazetteer
Portflio Web Application. Project Specification from 'IT Career Switch'.

Gazetteer was built as a 'mobile first' website, providing profiling for all countries through the presentation of demographic, climatic, geographical and other data via numerous thirs party APIs. This is facilitated primarily through extensive use of APIs. I used the open source Leaflet library to display the map and overlays, along with the Bootstrap framework to ease the task of design. The basic program flow is:

- Display loader whilst HTML renders.
- JQuery onload to retrieve current location.
- Update map with currently selected country border.
- AJAX call to PHP routine to OpenCage using location data to return core information.
- AJAX calls to PHP routines to other API providers using information obtained from OpenCage.
