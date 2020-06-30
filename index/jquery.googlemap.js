$(function() {
    $.fn.googleMap = function(a) {
        a = $.extend({ zoom: 10, coords: [48.895651, 2.290569], type: "ROADMAP", debug: false, langage: "english", overviewMapControl: false, streetViewControl: false, scrollwheel: false, mapTypeControl: false }, a);
        switch (a.type) {
            case "ROADMAP":
            case "SATELLITE":
            case "HYBRID":
            case "TERRAIN":
                a.type = google.maps.MapTypeId[a.type];
                break;
            default:
                a.type = google.maps.MapTypeId.ROADMAP;
                break
        }
        this.each(function() {
            var b = new google.maps.Map(this, { zoom: a.zoom, center: new google.maps.LatLng(a.coords[0], a.coords[1]), mapTypeId: a.type, scrollwheel: a.scrollwheel, streetViewControl: a.streetViewControl, overviewMapControl: a.overviewMapControl, mapTypeControl: a.mapTypeControl });
            $(this).data("googleMap", b);
            $(this).data("googleLang", a.langage);
            $(this).data("googleDebug", a.debug);
            $(this).data("googleMarker", new Array());
            $(this).data("googleBound", new google.maps.LatLngBounds())
        });
        return this
    };
    $.fn.addMarker = function(a) {
        a = $.extend({ coords: false, address: false, url: false, id: false, icon: false, draggable: false, title: "", text: "", success: function() {} }, a);
        this.each(function() {
            $this = $(this);
            if (!$this.data("googleMap")) { if ($this.data("googleDebug")) { console.error("jQuery googleMap : Unable to add a marker where there is no map !") } return false }
            if (!a.coords && !a.address) { if ($this.data("googleDebug")) { console.error("jQuery googleMap : Unable to add a marker if you don't tell us where !") } return false }
            if (a.address && typeof a.address == "string") {
                var b = function(f) {
                    var g = new google.maps.Geocoder();
                    g.geocode({ address: a.address, bounds: f.data("googleBound"), language: f.data("googleLang") }, function(l, m) {
                        if (m == google.maps.GeocoderStatus.OK) {
                            f.data("googleBound").extend(l[0].geometry.location);
                            if (a.icon) { var k = new google.maps.Marker({ map: $this.data("googleMap"), position: l[0].geometry.location, title: a.title, icon: a.icon, draggable: a.draggable }) } else { var k = new google.maps.Marker({ map: f.data("googleMap"), position: l[0].geometry.location, title: a.title, draggable: a.draggable }) }
                            if (a.draggable) {
                                google.maps.event.addListener(k, "dragend", function() {
                                    var o = k.getPosition();
                                    var n = {};
                                    n.lat = o.lat();
                                    n.lon = o.lng();
                                    a.success(n, $this)
                                })
                            }
                            if (a.title != "" && a.text != "" && !a.url) {
                                var i = new google.maps.InfoWindow({ content: "<h1>" + a.title + "</h1>" + a.text });
                                var j = f.data("googleMap");
                                google.maps.event.addListener(k, "click", function() { i.open(j, k) })
                            } else { if (a.url) { google.maps.event.addListener(k, "click", function() { document.location = a.url }) } }
                            if (!a.id) { f.data("googleMarker").push(k) } else { f.data("googleMarker")[a.id] = k }
                            if (f.data("googleMarker").length == 1) {
                                f.data("googleMap").setCenter(l[0].geometry.location);
                                f.data("googleMap").setZoom(f.data("googleMap").getZoom())
                            } else { f.data("googleMap").fitBounds(f.data("googleBound")) }
                            var h = {};
                            h.lat = l[0].geometry.location.lat();
                            h.lon = l[0].geometry.location.lng();
                            a.success(h, $this)
                        } else { if ($this.data("googleDebug")) { console.error("jQuery googleMap : Unable to find the place asked for the marker (" + m + ")") } }
                    })
                }($this)
            } else {
                $this.data("googleBound").extend(new google.maps.LatLng(a.coords[0], a.coords[1]));
                if (a.icon) { var e = new google.maps.Marker({ map: $this.data("googleMap"), position: new google.maps.LatLng(a.coords[0], a.coords[1]), title: a.title, icon: a.icon, draggable: a.draggable }) } else { var e = new google.maps.Marker({ map: $this.data("googleMap"), position: new google.maps.LatLng(a.coords[0], a.coords[1]), title: a.title, draggable: a.draggable }) }
                if (a.title != "" && a.text != "" && !a.url) {
                    var c = new google.maps.InfoWindow({ content: "<h1>" + a.title + "</h1>" + a.text });
                    var d = $this.data("googleMap");
                    google.maps.event.addListener(e, "click", function() { c.open(d, e) })
                } else { if (a.url) { google.maps.event.addListener(e, "click", function() { document.location = a.url }) } }
                if (a.draggable) {
                    google.maps.event.addListener(e, "dragend", function() {
                        var g = e.getPosition();
                        var f = {};
                        f.lat = g.lat();
                        f.lon = g.lng();
                        a.success(f, $this)
                    })
                }
                if (!a.id) { $this.data("googleMarker").push(e) } else { $this.data("googleMarker")[a.id] = e }
                if ($this.data("googleMarker").length == 1) {
                    $this.data("googleMap").setCenter(new google.maps.LatLng(a.coords[0], a.coords[1]));
                    $this.data("googleMap").setZoom($this.data("googleMap").getZoom())
                } else { $this.data("googleMap").fitBounds($this.data("googleBound")) }
                a.success({ lat: a.coords[0], lon: a.coords[1] }, $this)
            }
        });
        return this
    };
    $.fn.removeMarker = function(a) { this.each(function() { var c = $(this); if (!c.data("googleMap")) { if (c.data("googleDebug")) { console.log("jQuery googleMap : Unable to delete a marker where there is no map !") } return false } var b = c.data("googleMarker"); if (typeof b[a] != "undefined") { b[a].setMap(null); if (c.data("googleDebug")) { console.log("jQuery googleMap : marker deleted") } return true } else { if (c.data("googleDebug")) { console.error("jQuery googleMap : Unable to delete a marker if it not exists !") } return false } }) };
    $.fn.addWay = function(d) {
        d = $.extend({ start: false, end: false, step: [], route: false, langage: "english" }, d);
        var a = new google.maps.DirectionsService({ region: "fr" });
        var g = new google.maps.DirectionsRenderer({ draggable: true, map: $(this).data("googleMap"), panel: document.getElementById(d.route), provideTripAlternatives: true });
        document.getElementById.innerHTML = "";
        var h = [];
        for (var c in d.step) {
            var f;
            if (typeof d.step[c] == "object") { f = new google.maps.LatLng(d.step[c][0], d.step[c][1]) } else { f = d.step[c] }
            h.push({ location: f, stopover: true })
        }
        if (typeof d.end != "object") {
            var b = function(i) {
                var j = new google.maps.Geocoder();
                j.geocode({ address: d.end, bounds: i.data("googleBound"), language: d.langage }, function(l, m) {
                    if (m == google.maps.GeocoderStatus.OK) {
                        var k = { origin: d.start, destination: l[0].geometry.location, travelMode: google.maps.DirectionsTravelMode.DRIVING, region: "fr", waypoints: h };
                        a.route(k, function(n, o) { if (o == google.maps.DirectionsStatus.OK) { g.setDirections(n) } else { if (i.data("googleDebug")) { console.error("jQuery googleMap : Unable to find the place asked for the route (" + n + ")") } } })
                    } else { if (i.data("googleDebug")) { console.error("jQuery googleMap : Address not found") } }
                })
            }($(this))
        } else {
            var e = { origin: d.start, destination: new google.maps.LatLng(d.end[0], d.end[1]), travelMode: google.maps.DirectionsTravelMode.DRIVING, region: "fr", waypoints: h };
            a.route(e, function(i, j) { if (j == google.maps.DirectionsStatus.OK) { g.setDirections(i) } else { if ($(this).data("googleDebug")) { console.error("jQuery googleMap : Address not found") } } })
        }
        return this
    }
});