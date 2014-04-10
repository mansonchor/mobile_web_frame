define("base/img_process",["megapix_img","exif","ua"],function(e,t){var i=e("megapix_img"),n=e("exif"),a=e("ua");t.start_img_process=function(e,t,a){var t=t||{},o=t.max_width||600,s=t.max_height||6e3,r=t.quality||.99,l=t.type||"image/jpeg";n.getData(e,function(){var t=n.getTag(this,"Orientation"),d=new i(e),c=new Image;d.render(c,{type:l,maxWidth:o,maxHeight:s,quality:r,orientation:t,render_callback:a})})},t.support_process=function(){var e=window.URL&&window.URL.createObjectURL?window.URL:window.webkitURL&&window.webkitURL.createObjectURL?window.webkitURL:!1;return 0!=e?!0:!1},t.can_web_upload_img=function(){var e=!this.support_process(),t="6.0">a.ios_version,i="undefined"!=typeof WeixinJSBridge&&a.isAndroid;return console.log(e),console.log(t),console.log(i),e||t||i?!1:!0}}),define("base/megapix_img",[],function(){function e(e){var t=e.naturalWidth,i=e.naturalHeight;if(t*i>1048576){var n=document.createElement("canvas");n.width=n.height=1;var a=n.getContext("2d");return a.drawImage(e,-t+1,0),0===a.getImageData(0,0,1,1).data[3]}return!1}function t(e,t,i){var n=document.createElement("canvas");n.width=1,n.height=i;var a=n.getContext("2d");a.drawImage(e,0,0);for(var o=a.getImageData(0,0,1,i).data,s=0,r=i,l=i;l>s;){var d=o[4*(l-1)+3];0===d?r=l:s=l,l=r+s>>1}var c=l/i;return 0===c?1:c}function i(e,t,i,a){var o=document.createElement("canvas");return n(e,o,t,i),o.toDataURL(a,t.quality||.8)}function n(i,n,o,s){var r=i.naturalWidth,l=i.naturalHeight,d=o.width,c=o.height,_=n.getContext("2d");_.save(),a(n,d,c,o.orientation);var p=e(i);p&&(r/=2,l/=2);var m=1024,u=document.createElement("canvas");u.width=u.height=m;for(var h=u.getContext("2d"),f=s?t(i,r,l):1,g=Math.ceil(m*d/r),v=Math.ceil(m*c/l/f),b=0,w=0;l>b;){for(var y=0,x=0;r>y;)h.clearRect(0,0,m,m),h.drawImage(i,-y,-b),_.drawImage(u,0,0,m,m,x,w,g,v),y+=m,x+=g;b+=m,w+=v}_.restore(),u=h=null}function a(e,t,i,n){switch(n){case 5:case 6:case 7:case 8:e.width=i,e.height=t;break;default:e.width=t,e.height=i}var a=e.getContext("2d");switch(n){case 2:a.translate(t,0),a.scale(-1,1);break;case 3:a.translate(t,i),a.rotate(Math.PI);break;case 4:a.translate(0,i),a.scale(1,-1);break;case 5:a.rotate(.5*Math.PI),a.scale(1,-1);break;case 6:a.rotate(.5*Math.PI),a.translate(0,-i);break;case 7:a.rotate(.5*Math.PI),a.translate(t,-i),a.scale(-1,1);break;case 8:a.rotate(-.5*Math.PI),a.translate(-t,0);break;default:}}function o(e){if(e instanceof Blob){var t=new Image,i=window.URL&&window.URL.createObjectURL?window.URL:window.webkitURL&&window.webkitURL.createObjectURL?window.webkitURL:null;if(!i)throw Error("No createObjectURL function found to create blob url");t.src=i.createObjectURL(e),this.blob=e,e=t}if(!e.naturalWidth&&!e.naturalHeight){var n=this;e.onload=function(){var e=n.imageLoadListeners;if(e){n.imageLoadListeners=null;for(var t=0,i=e.length;i>t;t++)e[t]()}},this.imageLoadListeners=[]}this.srcImage=e}return o.prototype.render=function(e,t){if(this.imageLoadListeners){var a=this;return this.imageLoadListeners.push(function(){a.render(e,t)}),void 0}t=t||{};var o=this.srcImage.naturalWidth,s=this.srcImage.naturalHeight,r=t.width,l=t.height,d=t.maxWidth,c=t.maxHeight,_=!this.blob||"image/jpeg"===this.blob.type;r&&!l?l=s*r/o<<0:l&&!r?r=o*l/s<<0:(r=o,l=s),d&&r>d&&(r=d,l=s*r/o<<0),c&&l>c&&(l=c,r=o*l/s<<0);var p={width:r,height:l};for(var m in t)p[m]=t[m];var u=e.tagName.toLowerCase();"img"===u?(e.src=i(this.srcImage,p,_,t.type),"function"==typeof t.render_callback&&t.render_callback.call(this,e.src)):"canvas"===u&&n(this.srcImage,e,p,_),"function"==typeof this.onrender&&this.onrender(e)},o}),define("base/exif",[],function(){var e=function(){function e(e){return!!e.exifdata}function t(e,t){function n(n){var a=i(n);e.exifdata=a||{},t&&t.call(e)}if(e instanceof Image)p(e.src,function(e){n(e.binaryResponse)});else if(window.FileReader&&e instanceof window.File){var a=new FileReader;a.onload=function(e){n(new _(e.target.result))},a.readAsBinaryString(e)}}function i(e){if(255!=e.getByteAt(0)||216!=e.getByteAt(1))return!1;for(var t,i=2,n=e.getLength();n>i;){if(255!=e.getByteAt(i))return m&&console.log("Not a valid marker at offset "+i+", found: "+e.getByteAt(i)),!1;if(t=e.getByteAt(i+1),22400==t)return m&&console.log("Found 0xFFE1 marker"),o(e,i+4,e.getShortAt(i+2,!0)-2);if(225==t)return m&&console.log("Found 0xFFE1 marker"),o(e,i+4,e.getShortAt(i+2,!0)-2);i+=2+e.getShortAt(i+2,!0)}}function n(e,t,i,n,o){var s,r,l,d=e.getShortAt(i,o),c={};for(l=0;d>l;l++)s=i+12*l+2,r=n[e.getShortAt(s,o)],!r&&m&&console.log("Unknown tag: "+e.getShortAt(s,o)),c[r]=a(e,s,t,i,o);return c}function a(e,t,i,n,a){var o,s,r,l,d,c,_=e.getShortAt(t+2,a),p=e.getLongAt(t+4,a),m=e.getLongAt(t+8,a)+i;switch(_){case 1:case 7:if(1==p)return e.getByteAt(t+8,a);for(o=p>4?m:t+8,s=[],l=0;p>l;l++)s[l]=e.getByteAt(o+l);return s;case 2:return o=p>4?m:t+8,e.getStringAt(o,p-1);case 3:if(1==p)return e.getShortAt(t+8,a);for(o=p>2?m:t+8,s=[],l=0;p>l;l++)s[l]=e.getShortAt(o+2*l,a);return s;case 4:if(1==p)return e.getLongAt(t+8,a);s=[];for(var l=0;p>l;l++)s[l]=e.getLongAt(m+4*l,a);return s;case 5:if(1==p)return d=e.getLongAt(m,a),c=e.getLongAt(m+4,a),r=new Number(d/c),r.numerator=d,r.denominator=c,r;for(s=[],l=0;p>l;l++)d=e.getLongAt(m+8*l,a),c=e.getLongAt(m+4+8*l,a),s[l]=new Number(d/c),s[l].numerator=d,s[l].denominator=c;return s;case 9:if(1==p)return e.getSLongAt(t+8,a);for(s=[],l=0;p>l;l++)s[l]=e.getSLongAt(m+4*l,a);return s;case 10:if(1==p)return e.getSLongAt(m,a)/e.getSLongAt(m+4,a);for(s=[],l=0;p>l;l++)s[l]=e.getSLongAt(m+8*l,a)/e.getSLongAt(m+4+8*l,a);return s}}function o(e,t){if("Exif"!=e.getStringAt(t,4))return m&&console.log("Not valid EXIF data! "+e.getStringAt(t,4)),!1;var i,a,o,s,r,l=t+6;if(18761==e.getShortAt(l))i=!1;else{if(19789!=e.getShortAt(l))return m&&console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"),!1;i=!0}if(42!=e.getShortAt(l+2,i))return m&&console.log("Not valid TIFF data! (no 0x002A)"),!1;if(8!=e.getLongAt(l+4,i))return m&&console.log("Not valid TIFF data! (First offset not 8)",e.getShortAt(l+4,i)),!1;if(a=n(e,l,l+8,h,i),a.ExifIFDPointer){s=n(e,l,l+a.ExifIFDPointer,u,i);for(o in s){switch(o){case"LightSource":case"Flash":case"MeteringMode":case"ExposureProgram":case"SensingMethod":case"SceneCaptureType":case"SceneType":case"CustomRendered":case"WhiteBalance":case"GainControl":case"Contrast":case"Saturation":case"Sharpness":case"SubjectDistanceRange":case"FileSource":s[o]=g[o][s[o]];break;case"ExifVersion":case"FlashpixVersion":s[o]=String.fromCharCode(s[o][0],s[o][1],s[o][2],s[o][3]);break;case"ComponentsConfiguration":s[o]=g.Components[s[o][0]]+g.Components[s[o][1]]+g.Components[s[o][2]]+g.Components[s[o][3]]}a[o]=s[o]}}if(a.GPSInfoIFDPointer){r=n(e,l,l+a.GPSInfoIFDPointer,f,i);for(o in r){switch(o){case"GPSVersionID":r[o]=r[o][0]+"."+r[o][1]+"."+r[o][2]+"."+r[o][3]}a[o]=r[o]}}return a}function s(i,n){return i instanceof Image&&!i.complete?!1:(e(i)?n&&n.call(i):t(i,n),!0)}function r(t,i){return e(t)?t.exifdata[i]:void 0}function l(t){if(!e(t))return{};var i,n=t.exifdata,a={};for(i in n)n.hasOwnProperty(i)&&(a[i]=n[i]);return a}function d(t){if(!e(t))return"";var i,n=t.exifdata,a="";for(i in n)n.hasOwnProperty(i)&&(a+="object"==typeof n[i]?n[i]instanceof Number?i+" : "+n[i]+" ["+n[i].numerator+"/"+n[i].denominator+"]\r\n":i+" : ["+n[i].length+" values]\r\n":i+" : "+n[i]+"\r\n");return a}function c(e){return i(e)}var _=function(e,t,i){var n=e,a=t||0,o=0;this.getRawData=function(){return n},"string"==typeof e?(o=i||n.length,this.getByteAt=function(e){return 255&n.charCodeAt(e+a)},this.getBytesAt=function(e,t){for(var i=[],o=0;t>o;o++)i[o]=255&n.charCodeAt(e+o+a);return i}):"unknown"==typeof e&&(o=i||IEBinary_getLength(n),this.getByteAt=function(e){return IEBinary_getByteAt(n,e+a)},this.getBytesAt=function(e,t){return new VBArray(IEBinary_getBytesAt(n,e+a,t)).toArray()}),this.getLength=function(){return o},this.getSByteAt=function(e){var t=this.getByteAt(e);return t>127?t-256:t},this.getShortAt=function(e,t){var i=t?(this.getByteAt(e)<<8)+this.getByteAt(e+1):(this.getByteAt(e+1)<<8)+this.getByteAt(e);return 0>i&&(i+=65536),i},this.getSShortAt=function(e,t){var i=this.getShortAt(e,t);return i>32767?i-65536:i},this.getLongAt=function(e,t){var i=this.getByteAt(e),n=this.getByteAt(e+1),a=this.getByteAt(e+2),o=this.getByteAt(e+3),s=t?(((i<<8)+n<<8)+a<<8)+o:(((o<<8)+a<<8)+n<<8)+i;return 0>s&&(s+=4294967296),s},this.getSLongAt=function(e,t){var i=this.getLongAt(e,t);return i>2147483647?i-4294967296:i},this.getStringAt=function(e,t){for(var i=[],n=this.getBytesAt(e,t),a=0;t>a;a++)i[a]=String.fromCharCode(n[a]);return i.join("")},this.getCharAt=function(e){return String.fromCharCode(this.getByteAt(e))},this.toBase64=function(){return window.btoa(n)},this.fromBase64=function(e){n=window.atob(e)}},p=function(){function e(){var e=null;return window.ActiveXObject?e=new ActiveXObject("Microsoft.XMLHTTP"):window.XMLHttpRequest&&(e=new XMLHttpRequest),e}function t(t,i,n){var a=e();a?(i&&(a.onload!==void 0?a.onload=function(){"200"==a.status?i(this):n&&n(),a=null}:a.onreadystatechange=function(){4==a.readyState&&("200"==a.status?i(this):n&&n(),a=null)}),a.open("HEAD",t,!0),a.send(null)):n&&n()}function i(t,i,n,a,o,s){var r=e();if(r){var l=0;a&&!o&&(l=a[0]);var d=0;a&&(d=a[1]-a[0]+1),i&&(r.onload!==void 0?r.onload=function(){"200"==r.status||"206"==r.status||"0"==r.status?(r.binaryResponse=new _(r.responseText,l,d),r.fileSize=s||r.getResponseHeader("Content-Length"),i(r)):n&&n(),r=null}:r.onreadystatechange=function(){if(4==r.readyState){if("200"==r.status||"206"==r.status||"0"==r.status){var e={status:r.status,binaryResponse:new _("unknown"==typeof r.responseBody?r.responseBody:r.responseText,l,d),fileSize:s||r.getResponseHeader("Content-Length")};i(e)}else n&&n();r=null}}),r.open("GET",t,!0),r.overrideMimeType&&r.overrideMimeType("text/plain; charset=x-user-defined"),a&&o&&r.setRequestHeader("Range","bytes="+a[0]+"-"+a[1]),r.setRequestHeader("If-Modified-Since","Sat, 1 Jan 1970 00:00:00 GMT"),r.send(null)}else n&&n()}return function(e,n,a,o){o?t(e,function(t){var s,r,l=parseInt(t.getResponseHeader("Content-Length"),10),d=t.getResponseHeader("Accept-Ranges");s=o[0],0>o[0]&&(s+=l),r=s+o[1]-1,i(e,n,a,[s,r],"bytes"==d,l)}):i(e,n,a)}}(),m=!1,u={36864:"ExifVersion",40960:"FlashpixVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",37121:"ComponentsConfiguration",37122:"CompressedBitsPerPixel",37500:"MakerNote",37510:"UserComment",40964:"RelatedSoundFile",36867:"DateTimeOriginal",36868:"DateTimeDigitized",37520:"SubsecTime",37521:"SubsecTimeOriginal",37522:"SubsecTimeDigitized",33434:"ExposureTime",33437:"FNumber",34850:"ExposureProgram",34852:"SpectralSensitivity",34855:"ISOSpeedRatings",34856:"OECF",37377:"ShutterSpeedValue",37378:"ApertureValue",37379:"BrightnessValue",37380:"ExposureBias",37381:"MaxApertureValue",37382:"SubjectDistance",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37396:"SubjectArea",37386:"FocalLength",41483:"FlashEnergy",41484:"SpatialFrequencyResponse",41486:"FocalPlaneXResolution",41487:"FocalPlaneYResolution",41488:"FocalPlaneResolutionUnit",41492:"SubjectLocation",41493:"ExposureIndex",41495:"SensingMethod",41728:"FileSource",41729:"SceneType",41730:"CFAPattern",41985:"CustomRendered",41986:"ExposureMode",41987:"WhiteBalance",41988:"DigitalZoomRation",41989:"FocalLengthIn35mmFilm",41990:"SceneCaptureType",41991:"GainControl",41992:"Contrast",41993:"Saturation",41994:"Sharpness",41995:"DeviceSettingDescription",41996:"SubjectDistanceRange",40965:"InteroperabilityIFDPointer",42016:"ImageUniqueID"},h={256:"ImageWidth",257:"ImageHeight",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer",40965:"InteroperabilityIFDPointer",258:"BitsPerSample",259:"Compression",262:"PhotometricInterpretation",274:"Orientation",277:"SamplesPerPixel",284:"PlanarConfiguration",530:"YCbCrSubSampling",531:"YCbCrPositioning",282:"XResolution",283:"YResolution",296:"ResolutionUnit",273:"StripOffsets",278:"RowsPerStrip",279:"StripByteCounts",513:"JPEGInterchangeFormat",514:"JPEGInterchangeFormatLength",301:"TransferFunction",318:"WhitePoint",319:"PrimaryChromaticities",529:"YCbCrCoefficients",532:"ReferenceBlackWhite",306:"DateTime",270:"ImageDescription",271:"Make",272:"Model",305:"Software",315:"Artist",33432:"Copyright"},f={0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude",5:"GPSAltitudeRef",6:"GPSAltitude",7:"GPSTimeStamp",8:"GPSSatellites",9:"GPSStatus",10:"GPSMeasureMode",11:"GPSDOP",12:"GPSSpeedRef",13:"GPSSpeed",14:"GPSTrackRef",15:"GPSTrack",16:"GPSImgDirectionRef",17:"GPSImgDirection",18:"GPSMapDatum",19:"GPSDestLatitudeRef",20:"GPSDestLatitude",21:"GPSDestLongitudeRef",22:"GPSDestLongitude",23:"GPSDestBearingRef",24:"GPSDestBearing",25:"GPSDestDistanceRef",26:"GPSDestDistance",27:"GPSProcessingMethod",28:"GPSAreaInformation",29:"GPSDateStamp",30:"GPSDifferential"},g={ExposureProgram:{0:"Not defined",1:"Manual",2:"Normal program",3:"Aperture priority",4:"Shutter priority",5:"Creative program",6:"Action program",7:"Portrait mode",8:"Landscape mode"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{0:"Unknown",1:"Daylight",2:"Fluorescent",3:"Tungsten (incandescent light)",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 - 5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},SensingMethod:{1:"Not defined",2:"One-chip color area sensor",3:"Two-chip color area sensor",4:"Three-chip color area sensor",5:"Color sequential area sensor",7:"Trilinear sensor",8:"Color sequential linear sensor"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},SceneType:{1:"Directly photographed"},CustomRendered:{0:"Normal process",1:"Custom process"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},GainControl:{0:"None",1:"Low gain up",2:"High gain up",3:"Low gain down",4:"High gain down"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},SubjectDistanceRange:{0:"Unknown",1:"Macro",2:"Close view",3:"Distant view"},FileSource:{3:"DSC"},Components:{0:"",1:"Y",2:"Cb",3:"Cr",4:"R",5:"G",6:"B"}};return{readFromBinaryFile:c,pretty:d,getTag:r,getAllTags:l,getData:s,Tags:u,TiffTags:h,GPSTags:f,StringValues:g}}();return e});