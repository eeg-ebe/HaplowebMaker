var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	this.r = new RegExp(r,opt.split("u").join(""));
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,match: function(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) {
			return this.r.m[n];
		} else {
			throw new js__$Boot_HaxeError("EReg::matched");
		}
	}
	,matchedLeft: function() {
		if(this.r.m == null) {
			throw new js__$Boot_HaxeError("No string matched");
		}
		return HxOverrides.substr(this.r.s,0,this.r.m.index);
	}
	,matchedRight: function() {
		if(this.r.m == null) {
			throw new js__$Boot_HaxeError("No string matched");
		}
		var sz = this.r.m.index + this.r.m[0].length;
		return HxOverrides.substr(this.r.s,sz,this.r.s.length - sz);
	}
	,matchedPos: function() {
		if(this.r.m == null) {
			throw new js__$Boot_HaxeError("No string matched");
		}
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) {
			len = -1;
		}
		if(this.r.global) {
			this.r.lastIndex = pos;
			var tmp = this.r;
			var tmp1 = len < 0 ? s : HxOverrides.substr(s,0,pos + len);
			this.r.m = tmp.exec(tmp1);
			var b = this.r.m != null;
			if(b) {
				this.r.s = s;
			}
			return b;
		} else {
			var b1 = this.match(len < 0 ? HxOverrides.substr(s,pos,null) : HxOverrides.substr(s,pos,len));
			if(b1) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b1;
		}
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,map: function(s,f) {
		var offset = 0;
		var buf_b = "";
		while(true) {
			if(offset >= s.length) {
				break;
			} else if(!this.matchSub(s,offset)) {
				buf_b += Std.string(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf_b += Std.string(HxOverrides.substr(s,offset,p.pos - offset));
			buf_b += Std.string(f(this));
			if(p.len == 0) {
				buf_b += Std.string(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else {
				offset = p.pos + p.len;
			}
			if(!this.r.global) {
				break;
			}
		}
		if(!this.r.global && offset > 0 && offset < s.length) {
			buf_b += Std.string(HxOverrides.substr(s,offset,null));
		}
		return buf_b;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10 ? "0" + m : "" + m) + "-" + (d < 10 ? "0" + d : "" + d) + " " + (h < 10 ? "0" + h : "" + h) + ":" + (mi < 10 ? "0" + mi : "" + mi) + ":" + (s < 10 ? "0" + s : "" + s);
};
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d["setTime"](0);
		d["setUTCHours"](k[0]);
		d["setUTCMinutes"](k[1]);
		d["setUTCSeconds"](k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) {
			i = 0;
		}
	}
	while(i < len) {
		if(a[i] === obj) {
			return i;
		}
		++i;
	}
	return -1;
};
HxOverrides.lastIndexOf = function(a,obj,i) {
	var len = a.length;
	if(i >= len) {
		i = len - 1;
	} else if(i < 0) {
		i += len;
	}
	while(i >= 0) {
		if(a[i] === obj) {
			return i;
		}
		--i;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) {
		return false;
	}
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var IntIterator = function(min,max) {
	this.min = min;
	this.max = max;
};
$hxClasses["IntIterator"] = IntIterator;
IntIterator.__name__ = ["IntIterator"];
IntIterator.prototype = {
	min: null
	,max: null
	,hasNext: function() {
		return this.min < this.max;
	}
	,next: function() {
		return this.min++;
	}
	,__class__: IntIterator
};
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
		var x = new _$List_ListNode(item,null);
		if(this.h == null) {
			this.h = x;
		} else {
			this.q.next = x;
		}
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = new _$List_ListNode(item,this.h);
		this.h = x;
		if(this.q == null) {
			this.q = x;
		}
		this.length++;
	}
	,first: function() {
		if(this.h == null) {
			return null;
		} else {
			return this.h.item;
		}
	}
	,last: function() {
		if(this.q == null) {
			return null;
		} else {
			return this.q.item;
		}
	}
	,pop: function() {
		if(this.h == null) {
			return null;
		}
		var x = this.h.item;
		this.h = this.h.next;
		if(this.h == null) {
			this.q = null;
		}
		this.length--;
		return x;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l.item == v) {
				if(prev == null) {
					this.h = l.next;
				} else {
					prev.next = l.next;
				}
				if(this.q == l) {
					this.q = prev;
				}
				this.length--;
				return true;
			}
			prev = l;
			l = l.next;
		}
		return false;
	}
	,iterator: function() {
		return new _$List_ListIterator(this.h);
	}
	,toString: function() {
		var s_b = "";
		var first = true;
		var l = this.h;
		s_b += "{";
		while(l != null) {
			if(first) {
				first = false;
			} else {
				s_b += ", ";
			}
			s_b += Std.string(Std.string(l.item));
			l = l.next;
		}
		s_b += "}";
		return s_b;
	}
	,join: function(sep) {
		var s_b = "";
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) {
				first = false;
			} else {
				s_b += sep == null ? "null" : "" + sep;
			}
			s_b += Std.string(l.item);
			l = l.next;
		}
		return s_b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l.item;
			l = l.next;
			if(f(v)) {
				l2.add(v);
			}
		}
		return l2;
	}
	,map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l.item;
			l = l.next;
			b.add(f(v));
		}
		return b;
	}
	,__class__: List
};
var _$List_ListNode = function(item,next) {
	this.item = item;
	this.next = next;
};
$hxClasses["_List.ListNode"] = _$List_ListNode;
_$List_ListNode.__name__ = ["_List","ListNode"];
_$List_ListNode.prototype = {
	item: null
	,next: null
	,__class__: _$List_ListNode
};
var _$List_ListIterator = function(head) {
	this.head = head;
};
$hxClasses["_List.ListIterator"] = _$List_ListIterator;
_$List_ListIterator.__name__ = ["_List","ListIterator"];
_$List_ListIterator.prototype = {
	head: null
	,hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		var val = this.head.item;
		this.head = this.head.next;
		return val;
	}
	,__class__: _$List_ListIterator
};
Math.__name__ = ["Math"];
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
};
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) {
		return null;
	} else {
		var tmp1;
		if(o.__properties__) {
			tmp = o.__properties__["get_" + field];
			tmp1 = tmp;
		} else {
			tmp1 = false;
		}
		if(tmp1) {
			return o[tmp]();
		} else {
			return o[field];
		}
	}
};
Reflect.setProperty = function(o,field,value) {
	var tmp;
	var tmp1;
	if(o.__properties__) {
		tmp = o.__properties__["set_" + field];
		tmp1 = tmp;
	} else {
		tmp1 = false;
	}
	if(tmp1) {
		o[tmp](value);
	} else {
		o[field] = value;
	}
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
			a.push(f);
		}
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	if(typeof(f) == "function") {
		return !(f.__name__ || f.__ename__);
	} else {
		return false;
	}
};
Reflect.compare = function(a,b) {
	if(a == b) {
		return 0;
	} else if(a > b) {
		return 1;
	} else {
		return -1;
	}
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) {
		return true;
	}
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) {
		return false;
	}
	if(f1.scope == f2.scope && f1.method == f2.method) {
		return f1.method != null;
	} else {
		return false;
	}
};
Reflect.isObject = function(v) {
	if(v == null) {
		return false;
	}
	var t = typeof(v);
	if(!(t == "string" || t == "object" && v.__enum__ == null)) {
		if(t == "function") {
			return (v.__name__ || v.__ename__) != null;
		} else {
			return false;
		}
	} else {
		return true;
	}
};
Reflect.isEnumValue = function(v) {
	if(v != null) {
		return v.__enum__ != null;
	} else {
		return false;
	}
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) {
		return false;
	}
	delete(o[field]);
	return true;
};
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0;
	var _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
};
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js_Boot.__instanceof(v,t);
};
Std.instance = function(value,c) {
	if((value instanceof c)) {
		return value;
	} else {
		return null;
	}
};
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) {
		v = parseInt(x);
	}
	if(isNaN(v)) {
		return null;
	}
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
Std.random = function(x) {
	if(x <= 0) {
		return 0;
	} else {
		return Math.floor(Math.random() * x);
	}
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	b: null
	,get_length: function() {
		return this.b.length;
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,addSub: function(s,pos,len) {
		this.b += len == null ? HxOverrides.substr(s,pos,null) : HxOverrides.substr(s,pos,len);
	}
	,toString: function() {
		return this.b;
	}
	,__class__: StringBuf
	,__properties__: {get_length:"get_length"}
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
};
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
};
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) {
		return s.split("\"").join("&quot;").split("'").join("&#039;");
	} else {
		return s;
	}
};
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&quot;").join("\"").split("&#039;").join("'").split("&amp;").join("&");
};
StringTools.startsWith = function(s,start) {
	if(s.length >= start.length) {
		return HxOverrides.substr(s,0,start.length) == start;
	} else {
		return false;
	}
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	if(slen >= elen) {
		return HxOverrides.substr(s,slen - elen,elen) == end;
	} else {
		return false;
	}
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	if(!(c > 8 && c < 14)) {
		return c == 32;
	} else {
		return true;
	}
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,r,l - r);
	} else {
		return s;
	}
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,0,l - r);
	} else {
		return s;
	}
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) {
		return s;
	}
	while(s.length < l) s = c + s;
	return s;
};
StringTools.rpad = function(s,c,l) {
	if(c.length <= 0) {
		return s;
	}
	while(s.length < l) s += c;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	while(true) {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
		if(!(n > 0)) {
			break;
		}
	}
	if(digits != null) {
		while(s.length < digits) s = "0" + s;
	}
	return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
StringTools.isEof = function(c) {
	return c != c;
};
StringTools.quoteUnixArg = function(argument) {
	if(argument == "") {
		return "''";
	}
	if(!new EReg("[^a-zA-Z0-9_@%+=:,./-]","").match(argument)) {
		return argument;
	}
	return "'" + StringTools.replace(argument,"'","'\"'\"'") + "'";
};
StringTools.quoteWinArg = function(argument,escapeMetaCharacters) {
	if(!new EReg("^[^ \t\\\\\"]+$","").match(argument)) {
		var result_b = "";
		var needquote = argument.indexOf(" ") != -1 || argument.indexOf("\t") != -1 || argument == "";
		if(needquote) {
			result_b += "\"";
		}
		var bs_buf = new StringBuf();
		var _g1 = 0;
		var _g = argument.length;
		while(_g1 < _g) {
			var i = _g1++;
			var _g2 = HxOverrides.cca(argument,i);
			if(_g2 == null) {
				var c = _g2;
				if(bs_buf.b.length > 0) {
					result_b += Std.string(bs_buf.b);
					bs_buf = new StringBuf();
				}
				result_b += String.fromCharCode(c);
			} else {
				switch(_g2) {
				case 34:
					var bs = bs_buf.b;
					result_b += bs == null ? "null" : "" + bs;
					result_b += bs == null ? "null" : "" + bs;
					bs_buf = new StringBuf();
					result_b += "\\\"";
					break;
				case 92:
					bs_buf.b += "\\";
					break;
				default:
					var c1 = _g2;
					if(bs_buf.b.length > 0) {
						result_b += Std.string(bs_buf.b);
						bs_buf = new StringBuf();
					}
					result_b += String.fromCharCode(c1);
				}
			}
		}
		result_b += Std.string(bs_buf.b);
		if(needquote) {
			result_b += Std.string(bs_buf.b);
			result_b += "\"";
		}
		argument = result_b;
	}
	if(escapeMetaCharacters) {
		var result_b1 = "";
		var _g11 = 0;
		var _g3 = argument.length;
		while(_g11 < _g3) {
			var i1 = _g11++;
			var c2 = HxOverrides.cca(argument,i1);
			if(StringTools.winMetaCharacters.indexOf(c2) >= 0) {
				result_b1 += "^";
			}
			result_b1 += String.fromCharCode(c2);
		}
		return result_b1;
	} else {
		return argument;
	}
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
ValueType.__empty_constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TUnknown];
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) {
		return null;
	} else {
		return js_Boot.getClass(o);
	}
};
Type.getEnum = function(o) {
	if(o == null) {
		return null;
	}
	return o.__enum__;
};
Type.getSuperClass = function(c) {
	return c.__super__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) {
		return null;
	}
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) {
		return null;
	}
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) {
		return null;
	}
	return e;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	case 9:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8]);
	case 10:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9]);
	case 11:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9],args[10]);
	case 12:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9],args[10],args[11]);
	case 13:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9],args[10],args[11],args[12]);
	case 14:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9],args[10],args[11],args[12],args[13]);
	default:
		throw new js__$Boot_HaxeError("Too many arguments");
	}
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) {
		throw new js__$Boot_HaxeError("No such constructor " + constr);
	}
	if(Reflect.isFunction(f)) {
		if(params == null) {
			throw new js__$Boot_HaxeError("Constructor " + constr + " need parameters");
		}
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) {
		throw new js__$Boot_HaxeError("Constructor " + constr + " does not need parameters");
	}
	return f;
};
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) {
		throw new js__$Boot_HaxeError(index + " is not a valid enum constructor index");
	}
	return Type.createEnum(e,c,params);
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"__meta__");
	HxOverrides.remove(a,"prototype");
	return a;
};
Type.getEnumConstructs = function(e) {
	return e.__constructs__.slice();
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "function":
		if(v.__name__ || v.__ename__) {
			return ValueType.TObject;
		}
		return ValueType.TFunction;
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) {
			return ValueType.TInt;
		}
		return ValueType.TFloat;
	case "object":
		if(v == null) {
			return ValueType.TNull;
		}
		var e = v.__enum__;
		if(e != null) {
			return ValueType.TEnum(e);
		}
		var c = js_Boot.getClass(v);
		if(c != null) {
			return ValueType.TClass(c);
		}
		return ValueType.TObject;
	case "string":
		return ValueType.TClass(String);
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumEq = function(a,b) {
	if(a == b) {
		return true;
	}
	try {
		if(a[0] != b[0]) {
			return false;
		}
		var _g1 = 2;
		var _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) {
				return false;
			}
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) {
			return false;
		}
	} catch( e1 ) {
		return false;
	}
	return true;
};
Type.enumConstructor = function(e) {
	return e[0];
};
Type.enumParameters = function(e) {
	return e.slice(2);
};
Type.enumIndex = function(e) {
	return e[1];
};
Type.allEnums = function(e) {
	return e.__empty_constructs__;
};
var draw_Connection = function(id,n1,n2,l) {
	this.id = id;
	this.n1 = n1;
	this.n2 = n2;
	this.l = l;
	this.expLength = this.n1.radius + this.n2.radius + this.l.length * 100;
	this.strokeColor = "grey";
	this.strokeWidth = 3;
	this.dashedArray = new List();
	this.drawMutsByLine = false;
	this.drawMutsByText = false;
	this.drawMutsByDots = false;
	this.drawMutsLineDashedArray = new List();
	this.drawMutsDotsDashedArray = new List();
};
$hxClasses["draw.Connection"] = draw_Connection;
draw_Connection.__name__ = ["draw","Connection"];
draw_Connection.prototype = {
	id: null
	,n1: null
	,n2: null
	,l: null
	,expLength: null
	,strokeColor: null
	,strokeWidth: null
	,dashedArray: null
	,drawMutsByLine: null
	,drawMutsLineStrokeColor: null
	,drawMutsLineWidth: null
	,drawMutsLineLen: null
	,drawMutsLineDashedArray: null
	,drawMutsByText: null
	,drawMutsTextFont: null
	,drawMutsTextSize: null
	,drawMutsTextColor: null
	,drawMutsTextPX: null
	,drawMutsTextPY: null
	,drawMutsByDots: null
	,drawMutsDotsSize: null
	,drawMutsDotsColor: null
	,drawMutsDotsDashedArray: null
	,getNodeSvg: function() {
		var result = new List();
		result.add("<line x1='");
		result.add(this.n1.xPos + "' y1='");
		result.add(this.n1.yPos + "' x2='");
		result.add(this.n2.xPos + "' y2='");
		result.add(this.n2.yPos + "' stroke='");
		result.add(this.strokeColor + "' stroke-width='");
		result.add(this.strokeWidth + "' ");
		if(!this.dashedArray.isEmpty()) {
			result.add("stroke-dasharray='");
			result.add(this.dashedArray.join(","));
			result.add("' ");
		}
		result.add("/>");
		if(this.drawMutsByLine || this.drawMutsByText || this.drawMutsByDots) {
			var vX = this.n1.xPos - this.n2.xPos;
			var vY = this.n1.yPos - this.n2.yPos;
			var vL = Math.sqrt(vX * vX + vY * vY);
			var eVX = vX / vL;
			var eVY = vY / vL;
			var startX = this.n2.xPos + eVX * this.n2.radius;
			var startY = this.n2.yPos + eVY * this.n2.radius;
			var endX = this.n2.xPos + vX - eVX * this.n1.radius;
			var endY = this.n2.yPos + vY - eVY * this.n1.radius;
			vX = (endX - startX) / (this.l.length + 1);
			vY = (endY - startY) / (this.l.length + 1);
			var iii = 0;
			var _g_head = this.l.h;
			while(_g_head != null) {
				var val = _g_head.item;
				_g_head = _g_head.next;
				var text = val;
				++iii;
				var x = startX + vX * iii;
				var y = startY + vY * iii;
				if(this.drawMutsByDots) {
					result.add("<circle cx='");
					result.add(x + "' cy='");
					result.add(y + "' r='");
					result.add(this.drawMutsDotsSize + "' fill='");
					result.add(this.drawMutsDotsColor);
					if(!this.drawMutsDotsDashedArray.isEmpty()) {
						result.add("' stroke-dasharray='");
						result.add(this.drawMutsDotsDashedArray.join(","));
						result.add("'");
					}
					result.add("/>");
				}
				if(this.drawMutsByLine) {
					var x1 = x - eVY * this.drawMutsLineLen;
					var y1 = y + eVX * this.drawMutsLineLen;
					var x2 = x + eVY * this.drawMutsLineLen;
					var y2 = y - eVX * this.drawMutsLineLen;
					result.add("<line x1='");
					result.add(x1 + "' y1='");
					result.add(y1 + "' x2='");
					result.add(x2 + "' y2='");
					result.add(y2 + "' stroke='");
					result.add(this.drawMutsLineStrokeColor + "' stroke-width='");
					result.add(this.drawMutsLineWidth + "'");
					if(!this.drawMutsLineDashedArray.isEmpty()) {
						result.add(" stroke-dasharray='");
						result.add(this.drawMutsLineDashedArray.join(","));
						result.add("'");
					}
					result.add("/>");
				}
				if(this.drawMutsByText) {
					result.add("<text x='");
					result.add(x + this.drawMutsTextPX + "' y='");
					result.add(y + this.drawMutsTextSize / 2 + this.drawMutsTextPY + "' fill='");
					result.add(this.drawMutsTextColor + "' font-family='");
					result.add(this.drawMutsTextFont + "' font-size='");
					result.add(this.drawMutsTextSize + "'");
					result.add(">" + text + "</text>");
				}
			}
		}
		return result.join("");
	}
	,__class__: draw_Connection
};
var draw_Drawer = function() { };
$hxClasses["draw.Drawer"] = draw_Drawer;
draw_Drawer.__name__ = ["draw","Drawer"];
draw_Drawer.main = function() {
	var lines = "".split("\n");
	var result = new List();
	var lineNo = 0;
	var currentNode = null;
	var readNames = false;
	var readCons = false;
	var readLinks = false;
	var _g = 0;
	while(_g < lines.length) {
		var line = lines[_g];
		++_g;
		++lineNo;
		var end = line.length;
		while(true) {
			var tmp;
			if(end > 0) {
				var cCode = HxOverrides.cca(line,end - 1);
				var result1 = false;
				var _g1 = 0;
				var _g11 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
				while(_g1 < _g11.length) {
					var ele = _g11[_g1];
					++_g1;
					if(ele == cCode) {
						result1 = true;
						break;
					}
				}
				tmp = result1;
			} else {
				tmp = false;
			}
			if(!tmp) {
				break;
			}
			--end;
		}
		var s = line.substring(0,end);
		var begin = 0;
		var sLen = s.length;
		while(true) {
			var tmp1;
			if(begin < sLen) {
				var cCode1 = HxOverrides.cca(s,begin);
				var result2 = false;
				var _g2 = 0;
				var _g12 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
				while(_g2 < _g12.length) {
					var ele1 = _g12[_g2];
					++_g2;
					if(ele1 == cCode1) {
						result2 = true;
						break;
					}
				}
				tmp1 = result2;
			} else {
				tmp1 = false;
			}
			if(!tmp1) {
				break;
			}
			++begin;
		}
		var line_ = HxOverrides.substr(s,begin,null);
		if(line_ == null || line_ == "" || line_.charAt(0) == "#") {
			continue;
		}
		var result3 = 0;
		while(true) {
			var cCode2 = HxOverrides.cca(line,result3);
			var result4 = false;
			var _g3 = 0;
			var _g13 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
			while(_g3 < _g13.length) {
				var ele2 = _g13[_g3];
				++_g3;
				if(ele2 == cCode2) {
					result4 = true;
					break;
				}
			}
			if(!result4) {
				break;
			}
			++result3;
		}
		var indents = result3;
		if(indents == 0 && (line_ == "SAMPLED_SEQUENCE" || line_ == "MEDIAN_VECTOR")) {
			if(currentNode != null) {
				result.add(currentNode);
			}
			currentNode = new parsing_Node();
			currentNode.type = line_ == "SAMPLED_SEQUENCE" ? parsing_SEQ_$TYPE.SAMPLED_SEQUENCE : parsing_SEQ_$TYPE.MEDIAN_VECTOR;
			readNames = false;
			readCons = false;
			readLinks = false;
			continue;
		}
		if(currentNode == null) {
			throw new js__$Boot_HaxeError("Expected SAMPLED_SEQUENCE or MEDIAN_VECTOR in line " + lineNo + "!");
		}
		if(indents == 2 && HxOverrides.substr(line_,0,"ID".length) == "ID") {
			currentNode.id = Std.parseInt(line_.split(" ")[1]);
		} else if(indents == 2 && HxOverrides.substr(line_,0,"FFR_ID".length) == "FFR_ID") {
			currentNode.spId = Std.parseInt(line_.split(" ")[1]);
		} else if(indents == 2 && HxOverrides.substr(line_,0,"SEQUENCE".length) == "SEQUENCE") {
			currentNode.seq = line_.split(" ")[1];
		} else if(!(indents == 2 && HxOverrides.substr(line_,0,"NB_NAMES".length) == "NB_NAMES")) {
			if(indents == 2 && HxOverrides.substr(line_,0,"NAMES".length) == "NAMES") {
				readNames = true;
				readCons = false;
				readLinks = false;
			} else if(indents == 2 && HxOverrides.substr(line_,0,"CONNECTED_TO".length) == "CONNECTED_TO") {
				readNames = false;
				readCons = true;
				readLinks = false;
			} else if(indents == 2 && HxOverrides.substr(line_,0,"LINKED_TO".length) == "LINKED_TO") {
				readNames = false;
				readCons = false;
				readLinks = true;
			} else if(indents == 4 && (readNames || readCons || readLinks)) {
				if(readNames) {
					currentNode.names.add(line_);
				} else if(readCons) {
					var d = line_.split(" ");
					var l = new List();
					var _g21 = 5;
					var _g14 = d.length;
					while(_g21 < _g14) {
						var i = _g21++;
						l.add(Std.parseInt(d[i]));
					}
					currentNode.cons.add(new util_Pair(Std.parseInt(d[1]),l));
				} else if(readLinks) {
					var d1 = line_.split(" ");
					currentNode.links.add(new util_Pair(Std.parseInt(d1[1]),Std.parseInt(d1[3])));
				}
			} else {
				throw new js__$Boot_HaxeError("Unexpected expression in line " + lineNo + "!");
			}
		}
	}
	if(currentNode != null) {
		result.add(currentNode);
	}
	var net = result;
	var g = new draw_Graph(net);
	var _g_head = g.nodes.h;
	while(_g_head != null) {
		var val = _g_head.item;
		_g_head = _g_head.next;
		var node = val;
		var n = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
		node.valid = false;
		node.xPos = n;
		var n1 = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
		node.valid = false;
		node.yPos = n1;
	}
	var _g_head1 = g.nodes.h;
	while(_g_head1 != null) {
		var val1 = _g_head1.item;
		_g_head1 = _g_head1.next;
		var node1 = val1;
		var needCheck = true;
		while(needCheck) {
			needCheck = false;
			var _g_head2 = g.nodes.h;
			while(_g_head2 != null) {
				var val2 = _g_head2.item;
				_g_head2 = _g_head2.next;
				var node2 = val2;
				if(node1.node.id > node2.node.id && node1.xPos == node2.xPos && node2.yPos == node2.yPos) {
					var n2 = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
					node1.valid = false;
					node1.xPos = n2;
					var n3 = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
					node1.valid = false;
					node1.yPos = n3;
					needCheck = true;
					break;
				}
			}
		}
	}
	var _g_head3 = g.nodes.h;
	while(_g_head3 != null) {
		var val3 = _g_head3.item;
		_g_head3 = _g_head3.next;
		var node3 = val3;
		node3.velocityX = 0;
		node3.velocityY = 0;
	}
	var tE = 0;
	var xDif;
	var yDif;
	var r;
	var stepCount = 0;
	var stopCritSteps;
	while(true) {
		++stepCount;
		stopCritSteps = false;
		tE = 0;
		var _g_head4 = g.nodes.h;
		while(_g_head4 != null) {
			var val4 = _g_head4.item;
			_g_head4 = _g_head4.next;
			var node4 = val4;
			node4.forceX = 0;
			node4.forceY = 0;
			var _g_head5 = g.nodes.h;
			while(_g_head5 != null) {
				var val5 = _g_head5.item;
				_g_head5 = _g_head5.next;
				var oNode = val5;
				if(node4 != oNode) {
					xDif = node4.xPos - oNode.xPos;
					yDif = node4.yPos - oNode.yPos;
					r = Math.sqrt(xDif * xDif + yDif * yDif);
					if(r > 1) {
						node4.forceX += 500.0 * xDif / (r * r);
						node4.forceY += 500.0 * yDif / (r * r);
					} else {
						r += 0.1;
						node4.forceX += 500.0 * (xDif + 10 * Math.random() * (Math.random() > 0.5 ? 1 : -1)) / (r * r);
						node4.forceY += 500.0 * (yDif + 10 * Math.random() * (Math.random() > 0.5 ? 1 : -1)) / (r * r);
					}
				}
			}
			var _g_head6 = g.cons.h;
			while(_g_head6 != null) {
				var val6 = _g_head6.item;
				_g_head6 = _g_head6.next;
				var con = val6;
				if(con.n1 == node4) {
					xDif = con.n2.xPos - con.n1.xPos;
					yDif = con.n2.yPos - con.n1.yPos;
				} else if(con.n2 == node4) {
					xDif = con.n1.xPos - con.n2.xPos;
					yDif = con.n1.yPos - con.n2.yPos;
				} else {
					continue;
				}
				r = Math.sqrt(xDif * xDif + yDif * yDif);
				var displacement = r - con.expLength;
				xDif /= r;
				yDif /= r;
				node4.forceX += 0.1 * displacement * xDif;
				node4.forceY += 0.1 * displacement * yDif;
			}
		}
		var _g_head7 = g.nodes.h;
		while(_g_head7 != null) {
			var val7 = _g_head7.item;
			_g_head7 = _g_head7.next;
			var node5 = val7;
			node5.velocityX = (node5.velocityX + node5.forceX) * 0.6;
			node5.velocityY = (node5.velocityY + node5.forceY) * 0.6;
			node5.valid = false;
			node5.xPos += node5.velocityX;
			node5.valid = false;
			node5.yPos += node5.velocityY;
			var l1 = Math.sqrt(node5.velocityX * node5.velocityX + node5.velocityY * node5.velocityY);
			tE += l1 * l1;
		}
		if(stepCount > 10000) {
			stopCritSteps = true;
		}
		if(!(tE > 0.5 && !stopCritSteps)) {
			break;
		}
	}
	var rx = 0;
	var _g_head8 = g.nodes.h;
	while(_g_head8 != null) {
		var val8 = _g_head8.item;
		_g_head8 = _g_head8.next;
		var node6 = val8;
		rx += node6.xPos;
	}
	var cx = rx / g.nodes.length;
	var ry = 0;
	var _g_head9 = g.nodes.h;
	while(_g_head9 != null) {
		var val9 = _g_head9.item;
		_g_head9 = _g_head9.next;
		var node7 = val9;
		ry += node7.yPos;
	}
	var cy = ry / g.nodes.length;
	var _g_head10 = g.nodes.h;
	while(_g_head10 != null) {
		var val10 = _g_head10.item;
		_g_head10 = _g_head10.next;
		var node8 = val10;
		node8.valid = false;
		node8.xPos -= cx;
		node8.valid = false;
		node8.yPos -= cy;
	}
	var l2 = new List();
	var _g_head11 = g.links.h;
	while(_g_head11 != null) {
		var val11 = _g_head11.item;
		_g_head11 = _g_head11.next;
		var link = val11;
		link.xPos = NaN;
		link.yPos = NaN;
		link.setByUser = false;
		var vX = link.n1.xPos - link.n2.xPos;
		var vY = link.n1.yPos - link.n2.yPos;
		var vrX = -vY / 8;
		var vrY = vX / 8;
		var mX = link.n2.xPos + vX / 2;
		var mY = link.n2.yPos + vY / 2;
		link.x1 = mX - vrX;
		link.y1 = mY - vrY;
		link.x2 = mX + vrX;
		link.y2 = mY + vrY;
		link.e1 = 0;
		link.e2 = 0;
		var _g_head12 = g.nodes.h;
		while(_g_head12 != null) {
			var val12 = _g_head12.item;
			_g_head12 = _g_head12.next;
			var node9 = val12;
			var dX = node9.xPos - link.x1;
			var dY = node9.yPos - link.y1;
			link.e1 += 1 / Math.sqrt(dX * dX + dY * dY);
			var dX1 = node9.xPos - link.x2;
			var dY1 = node9.yPos - link.y2;
			link.e2 += 1 / Math.sqrt(dX1 * dX1 + dY1 * dY1);
		}
		l2.add(link);
	}
	while(!l2.isEmpty()) {
		var bestEDiff = -1.0;
		var bestLink = null;
		var _g_head13 = l2.h;
		while(_g_head13 != null) {
			var val13 = _g_head13.item;
			_g_head13 = _g_head13.next;
			var link1 = val13;
			var eDiff = Math.abs(link1.e1 - link1.e2);
			if(eDiff > bestEDiff || bestEDiff == -1) {
				bestEDiff = eDiff;
				bestLink = link1;
			}
		}
		bestLink.xPos = bestLink.e1 < bestLink.e2 ? bestLink.x1 : bestLink.x2;
		bestLink.yPos = bestLink.e1 < bestLink.e2 ? bestLink.y1 : bestLink.y2;
		l2.remove(bestLink);
		var _g_head14 = l2.h;
		while(_g_head14 != null) {
			var val14 = _g_head14.item;
			_g_head14 = _g_head14.next;
			var link2 = val14;
			var dX2 = bestLink.xPos - link2.x1;
			var dY2 = bestLink.yPos - link2.y1;
			link2.e1 += 1 / Math.sqrt(dX2 * dX2 + dY2 * dY2);
			var dX3 = bestLink.xPos - link2.x2;
			var dY3 = bestLink.yPos - link2.y2;
			link2.e2 += 1 / Math.sqrt(dX3 * dX3 + dY3 * dY3);
		}
	}
	var _this_newline;
	var _this_indent;
	var _this_countingOffset = 1;
	_this_newline = "\n";
	_this_indent = "  ";
	var ow = -1;
	var oh = -1;
	var maxX = -Infinity;
	var maxY = -Infinity;
	var minX = Infinity;
	var minY = Infinity;
	var _g_head15 = g.nodes.h;
	while(_g_head15 != null) {
		var val15 = _g_head15.item;
		_g_head15 = _g_head15.next;
		var node10 = val15;
		var g1 = g.drawCirclesNames;
		maxX = Math.max(maxX,node10.xPos + node10.radius);
		maxY = Math.max(maxY,node10.yPos + node10.radius);
		minX = Math.min(minX,node10.xPos - node10.radius);
		minY = Math.min(minY,node10.yPos - node10.radius);
	}
	var _g_head16 = g.links.h;
	while(_g_head16 != null) {
		var val16 = _g_head16.item;
		_g_head16 = _g_head16.next;
		var link3 = val16;
		var tMax = 0;
		var bX = 2 * link3.xPos - (link3.n1.xPos + link3.n2.xPos) / 2;
		if(2 * bX - link3.n1.xPos - link3.n2.xPos != 0) {
			tMax = (bX - link3.n1.xPos) / (2 * bX - link3.n1.xPos - link3.n2.xPos);
		}
		if(0 <= tMax && tMax <= 1) {
			tMax = tMax;
		} else {
			tMax = 0;
		}
		var x = (1 - tMax) * ((1 - tMax) * link3.n1.xPos + tMax * bX) + tMax * ((1 - tMax) * bX + tMax * link3.n2.xPos);
		var tMax1 = 0;
		var bY = 2 * link3.yPos - (link3.n1.yPos + link3.n2.yPos) / 2;
		if(2 * bY - link3.n1.yPos - link3.n2.yPos != 0) {
			tMax1 = (bY - link3.n1.yPos) / (2 * bY - link3.n1.yPos - link3.n2.yPos);
		}
		if(0 <= tMax1 && tMax1 <= 1) {
			tMax1 = tMax1;
		} else {
			tMax1 = 0;
		}
		var y = (1 - tMax1) * ((1 - tMax1) * link3.n1.yPos + tMax1 * bY) + tMax1 * ((1 - tMax1) * bY + tMax1 * link3.n2.yPos);
		maxX = Math.max(maxX,x);
		maxY = Math.max(maxY,y);
		minX = Math.min(minX,x);
		minY = Math.min(minY,y);
	}
	var width = maxX - minX + 200;
	var height = maxY - minY + 200;
	var f1 = ow / width;
	if(ow == -1) {
		f1 = 1;
	}
	var f2 = oh / height;
	if(oh == -1) {
		f2 = 1;
	}
	g.lastStretchFact = Math.min(f1,f2);
	ow = width * g.lastStretchFact;
	oh = height * g.lastStretchFact;
	var result5 = new List();
	result5.add("<svg version='1.1' baseProfile='full' width='" + ow);
	result5.add("' height='" + oh);
	result5.add("' viewBox='" + (minX - 100) + "," + (minY - 100) + "," + width + "," + height + "' xmlns='http://www.w3.org/2000/svg'>");
	if(g.drawCons) {
		var _g_head17 = g.cons.h;
		while(_g_head17 != null) {
			var val17 = _g_head17.item;
			_g_head17 = _g_head17.next;
			var con1 = val17;
			var result6 = new List();
			result6.add("<line x1='");
			result6.add(con1.n1.xPos + "' y1='");
			result6.add(con1.n1.yPos + "' x2='");
			result6.add(con1.n2.xPos + "' y2='");
			result6.add(con1.n2.yPos + "' stroke='");
			result6.add(con1.strokeColor + "' stroke-width='");
			result6.add(con1.strokeWidth + "' ");
			if(!con1.dashedArray.isEmpty()) {
				result6.add("stroke-dasharray='");
				result6.add(con1.dashedArray.join(","));
				result6.add("' ");
			}
			result6.add("/>");
			if(con1.drawMutsByLine || con1.drawMutsByText || con1.drawMutsByDots) {
				var vX1 = con1.n1.xPos - con1.n2.xPos;
				var vY1 = con1.n1.yPos - con1.n2.yPos;
				var vL = Math.sqrt(vX1 * vX1 + vY1 * vY1);
				var eVX = vX1 / vL;
				var eVY = vY1 / vL;
				var startX = con1.n2.xPos + eVX * con1.n2.radius;
				var startY = con1.n2.yPos + eVY * con1.n2.radius;
				var endX = con1.n2.xPos + vX1 - eVX * con1.n1.radius;
				var endY = con1.n2.yPos + vY1 - eVY * con1.n1.radius;
				vX1 = (endX - startX) / (con1.l.length + 1);
				vY1 = (endY - startY) / (con1.l.length + 1);
				var iii = 0;
				var _g_head18 = con1.l.h;
				while(_g_head18 != null) {
					var val18 = _g_head18.item;
					_g_head18 = _g_head18.next;
					var text = val18;
					++iii;
					var x1 = startX + vX1 * iii;
					var y1 = startY + vY1 * iii;
					if(con1.drawMutsByDots) {
						result6.add("<circle cx='");
						result6.add(x1 + "' cy='");
						result6.add(y1 + "' r='");
						result6.add(con1.drawMutsDotsSize + "' fill='");
						result6.add(con1.drawMutsDotsColor);
						if(!con1.drawMutsDotsDashedArray.isEmpty()) {
							result6.add("' stroke-dasharray='");
							result6.add(con1.drawMutsDotsDashedArray.join(","));
							result6.add("'");
						}
						result6.add("/>");
					}
					if(con1.drawMutsByLine) {
						var x11 = x1 - eVY * con1.drawMutsLineLen;
						var y11 = y1 + eVX * con1.drawMutsLineLen;
						var x2 = x1 + eVY * con1.drawMutsLineLen;
						var y2 = y1 - eVX * con1.drawMutsLineLen;
						result6.add("<line x1='");
						result6.add(x11 + "' y1='");
						result6.add(y11 + "' x2='");
						result6.add(x2 + "' y2='");
						result6.add(y2 + "' stroke='");
						result6.add(con1.drawMutsLineStrokeColor + "' stroke-width='");
						result6.add(con1.drawMutsLineWidth + "'");
						if(!con1.drawMutsLineDashedArray.isEmpty()) {
							result6.add(" stroke-dasharray='");
							result6.add(con1.drawMutsLineDashedArray.join(","));
							result6.add("'");
						}
						result6.add("/>");
					}
					if(con1.drawMutsByText) {
						result6.add("<text x='");
						result6.add(x1 + con1.drawMutsTextPX + "' y='");
						result6.add(y1 + con1.drawMutsTextSize / 2 + con1.drawMutsTextPY + "' fill='");
						result6.add(con1.drawMutsTextColor + "' font-family='");
						result6.add(con1.drawMutsTextFont + "' font-size='");
						result6.add(con1.drawMutsTextSize + "'");
						result6.add(">" + text + "</text>");
					}
				}
			}
			result5.add(result6.join(""));
		}
	}
	if(g.drawCurves) {
		result5.add("<g fill='none'>");
		var _g_head19 = g.links.h;
		while(_g_head19 != null) {
			var val19 = _g_head19.item;
			_g_head19 = _g_head19.next;
			var link4 = val19;
			var result7 = new List();
			if(link4.strokeColorList == null || link4.strokeColorList.isEmpty()) {
				result7.add("<path d='M");
				result7.add(link4.n1.xPos + " ");
				result7.add(link4.n1.yPos + " Q");
				result7.add(" " + (2 * link4.xPos - (link4.n1.xPos + link4.n2.xPos) / 2));
				result7.add(" " + (2 * link4.yPos - (link4.n1.yPos + link4.n2.yPos) / 2));
				result7.add(" " + link4.n2.xPos);
				result7.add(" " + link4.n2.yPos);
				result7.add("' stroke='");
				if(link4.strokeColor == null) {
					haxe_Log.trace("WRN: Use black instead of null as strokecolor",{ fileName : "Link.hx", lineNumber : 71, className : "draw.Link", methodName : "getLinkSvg"});
					result7.add("black");
				} else {
					result7.add(link4.strokeColor);
				}
				result7.add("' stroke-width='");
				result7.add(link4.strokeWidth + "' ");
				if(!link4.dashedArray.isEmpty()) {
					result7.add("stroke-dasharray='");
					result7.add(link4.dashedArray.join(","));
					result7.add("' ");
				}
				result7.add("/>");
			} else {
				var b00X = -2 * (link4.xPos - link4.n1.xPos);
				var b00Y = -2 * (link4.yPos - link4.n1.yPos);
				var b10X = -2 * (link4.n2.xPos - link4.xPos);
				var b10Y = -2 * (link4.n2.yPos - link4.yPos);
				var b05X = b00X + b10X;
				var b05Y = b00Y + b10Y;
				var v00X = b00Y;
				var v00Y = -b00X;
				var l00 = Math.sqrt(v00X * v00X + v00Y * v00Y);
				v00X /= l00;
				v00Y /= l00;
				var v10X = b10Y;
				var v10Y = -b10X;
				var l10 = Math.sqrt(v10X * v10X + v10Y * v10Y);
				v10X /= l10;
				v10Y /= l10;
				var v05X = b05Y;
				var v05Y = -b05X;
				var l05 = Math.sqrt(v05X * v05X + v05Y * v05Y);
				v05X /= l05;
				v05Y /= l05;
				var sum = 0;
				var _g_head20 = link4.strokeColorList.h;
				while(_g_head20 != null) {
					var val20 = _g_head20.item;
					_g_head20 = _g_head20.next;
					var p = val20;
					sum += p.second;
				}
				var dSum = 0;
				var factor = link4.strokeWidth / sum;
				var _g_head21 = link4.strokeColorList.h;
				while(_g_head21 != null) {
					var val21 = _g_head21.item;
					_g_head21 = _g_head21.next;
					var p1 = val21;
					var c = p1.first;
					var d2 = p1.second;
					var l3 = ((sum - d2) / 2 - dSum) * factor;
					dSum += d2;
					result7.add("<path d='M");
					result7.add(link4.n1.xPos + v00X * l3 + " ");
					result7.add(link4.n1.yPos + v00Y * l3 + " Q");
					result7.add(" " + (2 * (link4.xPos + v05X * l3) - (link4.n1.xPos + v00X * l3 + (link4.n2.xPos + v10X * l3)) / 2));
					result7.add(" " + (2 * (link4.yPos + v05Y * l3) - (link4.n1.yPos + v00Y * l3 + (link4.n2.yPos + v10Y * l3)) / 2));
					result7.add(" " + (link4.n2.xPos + v10X * l3));
					result7.add(" " + (link4.n2.yPos + v10Y * l3));
					result7.add("' stroke='");
					if(c == null) {
						haxe_Log.trace("WRN: Use black instead of null as strokecolor",{ fileName : "Link.hx", lineNumber : 128, className : "draw.Link", methodName : "getLinkSvg"});
						result7.add("black");
					} else {
						result7.add(c);
					}
					result7.add("' stroke-width='");
					result7.add(d2 * factor + "' ");
					if(!link4.dashedArray.isEmpty()) {
						result7.add("stroke-dasharray='");
						result7.add(link4.dashedArray.join(","));
						result7.add("' ");
					}
					result7.add("/>");
				}
			}
			result5.add(result7.join(""));
		}
		result5.add("</g>");
	}
	if(g.drawLoops) {
		var _g_head22 = g.nodes.h;
		while(_g_head22 != null) {
			var val22 = _g_head22.item;
			_g_head22 = _g_head22.next;
			var node11 = val22;
			var n4 = 0;
			var map = new haxe_ds_StringMap();
			var _g_head23 = node11.node.names.h;
			while(_g_head23 != null) {
				var val23 = _g_head23.item;
				_g_head23 = _g_head23.next;
				var name = val23;
				var result8 = name;
				if(name != null) {
					var pos = name.lastIndexOf(mj_Seq.delimiter);
					if(pos != -1) {
						result8 = HxOverrides.substr(name,0,pos);
					}
				}
				var indName = result8;
				if(__map_reserved[indName] != null ? map.existsReserved(indName) : map.h.hasOwnProperty(indName)) {
					if((__map_reserved[indName] != null ? map.getReserved(indName) : map.h[indName]) == 0) {
						if(__map_reserved[indName] != null) {
							map.setReserved(indName,1);
						} else {
							map.h[indName] = 1;
						}
						++n4;
					}
				} else if(__map_reserved[indName] != null) {
					map.setReserved(indName,0);
				} else {
					map.h[indName] = 0;
				}
			}
			haxe_Log.trace("XXX " + n4 + " " + node11.xPos + " " + node11.yPos,{ fileName : "NodePos.hx", lineNumber : 246, className : "draw.NodePos", methodName : "getLoopSvg"});
			var tmp2;
			if(n4 == 0) {
				tmp2 = "";
			} else {
				var l4 = Math.sqrt(node11.xPos * node11.xPos + node11.yPos * node11.yPos);
				var x3;
				var y3;
				if(l4 < 0.1) {
					x3 = node11.xPos + node11.radius / 1.414213562;
					y3 = node11.yPos + node11.radius / 1.414213562;
				} else {
					x3 = node11.xPos + node11.xPos / l4 * node11.radius;
					y3 = node11.yPos + node11.yPos / l4 * node11.radius;
				}
				tmp2 = "<circle cx='" + x3 + "' cy='" + y3 + "' r='" + node11.radius + "' stroke-width='" + n4 + "' stroke='black' fill='none'/>";
			}
			result5.add(tmp2);
		}
	}
	if(g.drawCircles) {
		var _g_head24 = g.nodes.h;
		while(_g_head24 != null) {
			var val24 = _g_head24.item;
			_g_head24 = _g_head24.next;
			var node12 = val24;
			var tmp3;
			if(!g.drawCirclesMedians && node12.node.type != parsing_SEQ_$TYPE.SAMPLED_SEQUENCE) {
				tmp3 = "";
			} else if(node12.valid) {
				tmp3 = node12.svg;
			} else {
				var result9 = new List();
				node12.pie = node12.pie.filter(function(t) {
					if(t.first != null && t.first != "") {
						return t.second > 0;
					} else {
						return false;
					}
				});
				var needArcs = false;
				result9.add("<circle id='");
				result9.add("n" + node12.node.id);
				result9.add("' ");
				result9.add("stroke='");
				result9.add(node12.strokeColor);
				result9.add("' ");
				result9.add("stroke-width='");
				result9.add("" + node12.strokeWidth);
				result9.add("' ");
				if(!node12.dashedArray.isEmpty()) {
					result9.add("stroke-dasharray='");
					result9.add(node12.dashedArray.join(","));
					result9.add("' ");
				}
				result9.add("cx='");
				result9.add("" + node12.xPos);
				result9.add("' ");
				result9.add("cy='");
				result9.add("" + node12.yPos);
				result9.add("' ");
				result9.add("r='");
				result9.add("" + node12.radius);
				result9.add("' ");
				if(node12.pie.isEmpty()) {
					result9.add("fill='black'");
				} else if(node12.pie.length == 1) {
					result9.add("fill='");
					result9.add(node12.pie.first().first);
					result9.add("' ");
				} else {
					needArcs = true;
				}
				result9.add("/>");
				if(needArcs) {
					var summe = 0;
					var _g_head25 = node12.pie.h;
					while(_g_head25 != null) {
						var val25 = _g_head25.item;
						_g_head25 = _g_head25.next;
						var p2 = val25;
						summe += p2.second;
					}
					var cs = 0;
					var _g_head26 = node12.pie.h;
					while(_g_head26 != null) {
						var val26 = _g_head26.item;
						_g_head26 = _g_head26.next;
						var p3 = val26;
						var color = p3.first;
						var perc = p3.second / summe;
						var pX1 = Math.sin(cs / summe * 2 * Math.PI) * node12.radius + node12.xPos;
						var pY1 = -Math.cos(cs / summe * 2 * Math.PI) * node12.radius + node12.yPos;
						cs += p3.second;
						var pX2 = Math.sin(cs / summe * 2 * Math.PI) * node12.radius + node12.xPos;
						var pY2 = -Math.cos(cs / summe * 2 * Math.PI) * node12.radius + node12.yPos;
						var arcFlag = perc < 0.5 ? 0 : 1;
						result9.add("<path fill='" + color + "' d='M" + node12.xPos + "," + node12.yPos + "L" + pX1 + "," + pY1 + "A" + node12.radius + "," + node12.radius + " 1 " + arcFlag + ",1 " + pX2 + ", " + pY2 + " z'/>");
					}
				}
				node12.svg = result9.join("");
				node12.valid = true;
				tmp3 = node12.svg;
			}
			result5.add(tmp3);
		}
	}
	if(g.drawCirclesNames) {
		result5.add("<g font-size=\"" + g.textSize + "px\" font-family=\"Times\">");
		var _g_head27 = g.nodes.h;
		while(_g_head27 != null) {
			var val27 = _g_head27.item;
			_g_head27 = _g_head27.next;
			var node13 = val27;
			var tmp4;
			if(node13.node.type != parsing_SEQ_$TYPE.SAMPLED_SEQUENCE) {
				tmp4 = "";
			} else {
				var x4 = node13.xPos + node13.radius + 5;
				var y4 = node13.yPos + node13.radius + 5;
				tmp4 = "<text x='" + x4 + "' y='" + y4 + "'>" + node13.node.names.first() + "</text>";
			}
			result5.add(tmp4);
		}
		result5.add("</g>");
	}
	if(g.drawAngles) {
		var _g_head28 = g.cons.h;
		while(_g_head28 != null) {
			var val28 = _g_head28.item;
			_g_head28 = _g_head28.next;
			var c1 = val28;
			var _g_head29 = g.cons.h;
			while(_g_head29 != null) {
				var val29 = _g_head29.item;
				_g_head29 = _g_head29.next;
				var c2 = val29;
				if(c1.id > c2.id) {
					var nA = null;
					var nB = null;
					var nC = null;
					if(c1.n1 == c2.n1) {
						nA = c1.n2;
						nB = c2.n2;
						nC = c1.n1;
					} else if(c1.n1 == c2.n2) {
						nA = c1.n2;
						nB = c2.n1;
						nC = c1.n1;
					} else if(c1.n2 == c2.n1) {
						nA = c1.n1;
						nB = c2.n2;
						nC = c1.n2;
					} else if(c1.n2 == c2.n2) {
						nA = c1.n1;
						nB = c2.n1;
						nC = c1.n2;
					}
					if(nC != null) {
						var v1X = nA.xPos - nC.xPos;
						var v1Y = nA.yPos - nC.yPos;
						var v2X = nB.xPos - nC.xPos;
						var v2Y = nB.yPos - nC.yPos;
						var l11 = Math.sqrt(v1X * v1X + v1Y * v1Y);
						var l21 = Math.sqrt(v2X * v2X + v2Y * v2Y);
						var c3 = v1X * v2X + v1Y * v2Y;
						var wXV = v1X / l11 + v2X / l21;
						var wYV = v1Y / l11 + v2Y / l21;
						var wL = Math.sqrt(wXV * wXV + wYV * wYV);
						var xx = nC.xPos + wXV / wL * (nC.radius + 20);
						var yy = nC.yPos + wYV / wL * (nC.radius + 20);
						var txt = HxOverrides.substr("" + Math.acos(c3 / (l11 * l21)) * 360 / (2 * Math.PI),0,6);
						result5.add("<text x='" + xx + "' y='" + yy + "' text-anchor='middle'>" + txt + "</text>");
					}
				}
			}
		}
	}
	if(g.drawBezierPoints) {
		var _g_head30 = g.links.h;
		while(_g_head30 != null) {
			var val30 = _g_head30.item;
			_g_head30 = _g_head30.next;
			var link5 = val30;
			result5.add("<circle cx='" + link5.xPos + "' cy='" + link5.yPos + "' r='5' fill='" + link5.strokeColor + "' stroke='" + (link5.setByUser ? "black" : "red") + "' />");
		}
	}
	if(g.drawCenter) {
		var rx1 = 0;
		var _g_head31 = g.nodes.h;
		while(_g_head31 != null) {
			var val31 = _g_head31.item;
			_g_head31 = _g_head31.next;
			var node14 = val31;
			rx1 += node14.xPos;
		}
		var x5 = rx1 / g.nodes.length;
		var ry1 = 0;
		var _g_head32 = g.nodes.h;
		while(_g_head32 != null) {
			var val32 = _g_head32.item;
			_g_head32 = _g_head32.next;
			var node15 = val32;
			ry1 += node15.yPos;
		}
		var y5 = ry1 / g.nodes.length;
		result5.add("<line x1='" + x5 + "' y1='" + minY + "' x2='" + x5 + "' y2='" + maxY + "' stroke='green' stroke-dasharray='3 3' />");
		result5.add("<line x1='" + minX + "' y1='" + y5 + "' x2='" + maxX + "' y2='" + y5 + "' stroke='green' stroke-dasharray='3 3' />");
		var rx2 = 0;
		var _g_head33 = g.nodes.h;
		while(_g_head33 != null) {
			var val33 = _g_head33.item;
			_g_head33 = _g_head33.next;
			var node16 = val33;
			rx2 += node16.xPos;
		}
		var tmp5 = "<circle cx='" + rx2 / g.nodes.length + "' cy='";
		var ry2 = 0;
		var _g_head34 = g.nodes.h;
		while(_g_head34 != null) {
			var val34 = _g_head34.item;
			_g_head34 = _g_head34.next;
			var node17 = val34;
			ry2 += node17.yPos;
		}
		result5.add(tmp5 + ry2 / g.nodes.length + "' r='5' fill='green' />");
	}
	result5.add("</svg>");
	var s1 = result5.join("");
	haxe_Log.trace(s1,{ fileName : "StdOutPrinter.hx", lineNumber : 15, className : "util.StdOutPrinter", methodName : "printString"});
};
var draw_Graph = function(l) {
	this.textSize = 20;
	this.drawAngles = false;
	this.drawCenter = false;
	this.drawBezierPoints = false;
	this.drawLoops = false;
	this.drawCurves = true;
	this.drawCons = true;
	this.drawCirclesMedians = false;
	this.drawCirclesNames = false;
	this.drawCircles = true;
	this.drawCircles = true;
	this.drawCirclesNames = false;
	this.drawCirclesMedians = false;
	this.drawCons = true;
	this.drawCurves = true;
	this.drawLoops = false;
	this.drawBezierPoints = false;
	this.drawCenter = false;
	this.drawAngles = false;
	this.nodes = new List();
	this.cons = new List();
	this.links = new List();
	var _g_head = l.h;
	while(_g_head != null) {
		var val = _g_head.item;
		_g_head = _g_head.next;
		var e = val;
		this.nodes.add(new draw_NodePos(e,this));
	}
	var nextConId = 0;
	var _g_head1 = this.nodes.h;
	while(_g_head1 != null) {
		var val1 = _g_head1.item;
		_g_head1 = _g_head1.next;
		var node1 = val1;
		var _g_head2 = this.nodes.h;
		while(_g_head2 != null) {
			var val2 = _g_head2.item;
			_g_head2 = _g_head2.next;
			var node2 = val2;
			if(node1.node.id > node2.node.id) {
				var _g_head3 = node2.node.cons.h;
				while(_g_head3 != null) {
					var val3 = _g_head3.item;
					_g_head3 = _g_head3.next;
					var con = val3;
					if(con.first == node1.node.id) {
						this.cons.add(new draw_Connection(nextConId++,node1,node2,con.second));
						break;
					}
				}
				var _g_head4 = node2.node.links.h;
				while(_g_head4 != null) {
					var val4 = _g_head4.item;
					_g_head4 = _g_head4.next;
					var con1 = val4;
					if(con1.first == node1.node.id) {
						this.links.add(new draw_Link(node1,node2,con1.second));
						break;
					}
				}
			}
		}
	}
};
$hxClasses["draw.Graph"] = draw_Graph;
draw_Graph.__name__ = ["draw","Graph"];
draw_Graph.generateRandomHex = function() {
	var rand = Math.random();
	var result = null;
	if(rand <= 0.0625) {
		result = "0";
	} else if(rand <= 0.125) {
		result = "1";
	} else if(rand <= 0.1875) {
		result = "2";
	} else if(rand <= 0.25) {
		result = "3";
	} else if(rand <= 0.3125) {
		result = "4";
	} else if(rand <= 0.375) {
		result = "5";
	} else if(rand <= 0.4375) {
		result = "6";
	} else if(rand <= 0.5) {
		result = "7";
	} else if(rand <= 0.5625) {
		result = "8";
	} else if(rand <= 0.625) {
		result = "9";
	} else if(rand <= 0.6875) {
		result = "A";
	} else if(rand <= 0.75) {
		result = "B";
	} else if(rand <= 0.8125) {
		result = "C";
	} else if(rand <= 0.875) {
		result = "D";
	} else if(rand <= 0.9375) {
		result = "E";
	} else {
		result = "F";
	}
	return result;
};
draw_Graph.dist = function(x1,y1,x2,y2) {
	var dX = x1 - x2;
	var dY = y1 - y2;
	return Math.sqrt(dX * dX + dY * dY);
};
draw_Graph.main = function() {
};
draw_Graph.prototype = {
	nodes: null
	,cons: null
	,links: null
	,drawCircles: null
	,drawCirclesNames: null
	,drawCirclesMedians: null
	,drawCons: null
	,drawCurves: null
	,drawLoops: null
	,drawBezierPoints: null
	,drawCenter: null
	,drawAngles: null
	,lastStretchFact: null
	,textSize: null
	,assignMutsLines: function(drawMutsByLine,drawMutsLineStrokeColor,drawMutsLineWidth,drawMutsLineLen,drawMutsLineDashedArray) {
		var drawMutsLineDashedArray_ = new List();
		var _g = 0;
		while(_g < drawMutsLineDashedArray.length) {
			var e = drawMutsLineDashedArray[_g];
			++_g;
			drawMutsLineDashedArray_.add(e);
		}
		var _g_head = this.cons.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var con = val;
			con.drawMutsByLine = drawMutsByLine;
			con.drawMutsLineStrokeColor = drawMutsLineStrokeColor;
			con.drawMutsLineWidth = drawMutsLineWidth;
			con.drawMutsLineLen = drawMutsLineLen;
			con.drawMutsLineDashedArray = drawMutsLineDashedArray_;
		}
	}
	,assignMutsText: function(drawMutsByText,drawMutsTextFont,drawMutsTextSize,drawMutsTextColor,drawMutsTextPX,drawMutsTextPY) {
		var _g_head = this.cons.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var con = val;
			con.drawMutsByText = drawMutsByText;
			con.drawMutsTextFont = drawMutsTextFont;
			con.drawMutsTextSize = drawMutsTextSize;
			con.drawMutsTextColor = drawMutsTextColor;
			con.drawMutsTextPX = drawMutsTextPX;
			con.drawMutsTextPY = drawMutsTextPY;
		}
	}
	,assignButsByDots: function(drawMutsByDots,drawMutsDotsSize,drawMutsDotsColor,drawMutsDotsDashedArray) {
		var drawMutsDotsDashedArray_ = new List();
		var _g = 0;
		while(_g < drawMutsDotsDashedArray.length) {
			var e = drawMutsDotsDashedArray[_g];
			++_g;
			drawMutsDotsDashedArray_.add(e);
		}
		var _g_head = this.cons.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var con = val;
			con.drawMutsByDots = drawMutsByDots;
			con.drawMutsDotsSize = drawMutsDotsSize;
			con.drawMutsDotsColor = drawMutsDotsColor;
			con.drawMutsDotsDashedArray = drawMutsDotsDashedArray_;
		}
	}
	,getNearestO: function(x,y) {
		var maxX = -Infinity;
		var maxY = -Infinity;
		var minX = Infinity;
		var minY = Infinity;
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			maxX = Math.max(maxX,node.xPos + node.radius);
			maxY = Math.max(maxY,node.yPos + node.radius);
			minX = Math.min(minX,node.xPos - node.radius);
			minY = Math.min(minY,node.yPos - node.radius);
		}
		var _g_head1 = this.links.h;
		while(_g_head1 != null) {
			var val1 = _g_head1.item;
			_g_head1 = _g_head1.next;
			var link = val1;
			var tMax = 0;
			var bX = 2 * link.xPos - (link.n1.xPos + link.n2.xPos) / 2;
			if(2 * bX - link.n1.xPos - link.n2.xPos != 0) {
				tMax = (bX - link.n1.xPos) / (2 * bX - link.n1.xPos - link.n2.xPos);
			}
			if(0 <= tMax && tMax <= 1) {
				tMax = tMax;
			} else {
				tMax = 0;
			}
			var x1 = (1 - tMax) * ((1 - tMax) * link.n1.xPos + tMax * bX) + tMax * ((1 - tMax) * bX + tMax * link.n2.xPos);
			var tMax1 = 0;
			var bY = 2 * link.yPos - (link.n1.yPos + link.n2.yPos) / 2;
			if(2 * bY - link.n1.yPos - link.n2.yPos != 0) {
				tMax1 = (bY - link.n1.yPos) / (2 * bY - link.n1.yPos - link.n2.yPos);
			}
			if(0 <= tMax1 && tMax1 <= 1) {
				tMax1 = tMax1;
			} else {
				tMax1 = 0;
			}
			var y1 = (1 - tMax1) * ((1 - tMax1) * link.n1.yPos + tMax1 * bY) + tMax1 * ((1 - tMax1) * bY + tMax1 * link.n2.yPos);
			maxX = Math.max(maxX,x1);
			maxY = Math.max(maxY,y1);
			minX = Math.min(minX,x1);
			minY = Math.min(minY,y1);
		}
		x = x + minX - 100;
		y = y + minY - 100;
		var result = null;
		var best = Infinity;
		var d = 0;
		if(this.drawCircles) {
			var _g_head2 = this.nodes.h;
			while(_g_head2 != null) {
				var val2 = _g_head2.item;
				_g_head2 = _g_head2.next;
				var o = val2;
				var dX = x - o.xPos;
				var dY = y - o.yPos;
				d = Math.sqrt(dX * dX + dY * dY);
				if(d < best) {
					best = d;
					result = o;
				}
			}
		}
		if(this.drawBezierPoints) {
			var _g_head3 = this.links.h;
			while(_g_head3 != null) {
				var val3 = _g_head3.item;
				_g_head3 = _g_head3.next;
				var o1 = val3;
				var dX1 = x - o1.xPos;
				var dY1 = y - o1.yPos;
				d = Math.sqrt(dX1 * dX1 + dY1 * dY1);
				if(d < best) {
					best = d;
					result = o1;
				}
			}
		}
		return result;
	}
	,getNodeById: function(id) {
		var result = null;
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			if(node.node.id == id) {
				result = node;
				break;
			}
		}
		return result;
	}
	,assingPiesByTxt: function(s,ignoreCase,byIndNameOnly) {
		var l = parsing_LstParser.parseColorList(s);
		var warnings = new List();
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			if(node.node.names.length == 0) {
				var l1 = new List();
				l1.add(new util_Pair("grey",1));
				node.valid = false;
				node.pie = l1;
				continue;
			}
			var l_ = new List();
			var warnings1 = new List();
			var _g_head1 = node.node.names.h;
			while(_g_head1 != null) {
				var val1 = _g_head1.item;
				_g_head1 = _g_head1.next;
				var name = val1;
				if(byIndNameOnly) {
					var result = name;
					if(name != null) {
						var pos = name.lastIndexOf(mj_Seq.delimiter);
						if(pos != -1) {
							result = HxOverrides.substr(name,0,pos);
						}
					}
					name = result;
				}
				var colorName = null;
				var _g_head2 = l.h;
				while(_g_head2 != null) {
					var val2 = _g_head2.item;
					_g_head2 = _g_head2.next;
					var p = val2;
					if(ignoreCase) {
						if(p.first.toUpperCase() == name.toUpperCase()) {
							colorName = p.second.toLowerCase();
							break;
						}
					} else if(p.first == name) {
						colorName = p.second.toLowerCase();
						break;
					}
				}
				if(colorName == null) {
					haxe_Log.trace("No colorname found for individual '" + name + "'!",{ fileName : "NodePos.hx", lineNumber : 106, className : "draw.NodePos", methodName : "set_pieByLst"});
					warnings1.add(name);
					colorName = "black";
				}
				var found = false;
				var _g_head3 = l_.h;
				while(_g_head3 != null) {
					var val3 = _g_head3.item;
					_g_head3 = _g_head3.next;
					var p1 = val3;
					if(p1.first == colorName) {
						p1.second++;
						found = true;
						break;
					}
				}
				if(!found) {
					l_.add(new util_Pair(colorName,1));
				}
			}
			node.valid = false;
			node.pie = l_;
			var result1 = warnings1.join(",");
			if(result1 != "") {
				warnings.add(result1);
			}
		}
		return warnings.join(",");
	}
	,assignPieCharts: function(l,ignoreCase,byIndNameOnly) {
		var warnings = new List();
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			if(node.node.names.length == 0) {
				var l1 = new List();
				l1.add(new util_Pair("grey",1));
				node.valid = false;
				node.pie = l1;
				continue;
			}
			var l_ = new List();
			var warnings1 = new List();
			var _g_head1 = node.node.names.h;
			while(_g_head1 != null) {
				var val1 = _g_head1.item;
				_g_head1 = _g_head1.next;
				var name = val1;
				if(byIndNameOnly) {
					var result = name;
					if(name != null) {
						var pos = name.lastIndexOf(mj_Seq.delimiter);
						if(pos != -1) {
							result = HxOverrides.substr(name,0,pos);
						}
					}
					name = result;
				}
				var colorName = null;
				var _g_head2 = l.h;
				while(_g_head2 != null) {
					var val2 = _g_head2.item;
					_g_head2 = _g_head2.next;
					var p = val2;
					if(ignoreCase) {
						if(p.first.toUpperCase() == name.toUpperCase()) {
							colorName = p.second.toLowerCase();
							break;
						}
					} else if(p.first == name) {
						colorName = p.second.toLowerCase();
						break;
					}
				}
				if(colorName == null) {
					haxe_Log.trace("No colorname found for individual '" + name + "'!",{ fileName : "NodePos.hx", lineNumber : 106, className : "draw.NodePos", methodName : "set_pieByLst"});
					warnings1.add(name);
					colorName = "black";
				}
				var found = false;
				var _g_head3 = l_.h;
				while(_g_head3 != null) {
					var val3 = _g_head3.item;
					_g_head3 = _g_head3.next;
					var p1 = val3;
					if(p1.first == colorName) {
						p1.second++;
						found = true;
						break;
					}
				}
				if(!found) {
					l_.add(new util_Pair(colorName,1));
				}
			}
			node.valid = false;
			node.pie = l_;
			var result1 = warnings1.join(",");
			if(result1 != "") {
				warnings.add(result1);
			}
		}
		return warnings.join(",");
	}
	,initStrokeColorListByStr: function(s,ignoreCase) {
		this.initStrokeColorList(parsing_LstParser.parseColorList(s),ignoreCase);
	}
	,initStrokeColorList: function(l,ignoreCase) {
		var _g_head = this.links.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var link = val;
			var map = new haxe_ds_StringMap();
			var _g_head1 = link.n1.node.names.h;
			while(_g_head1 != null) {
				var val1 = _g_head1.item;
				_g_head1 = _g_head1.next;
				var name1 = val1;
				var result = name1;
				if(name1 != null) {
					var pos = name1.lastIndexOf(mj_Seq.delimiter);
					if(pos != -1) {
						result = HxOverrides.substr(name1,0,pos);
					}
				}
				var nn1 = result;
				var _g_head2 = link.n2.node.names.h;
				while(_g_head2 != null) {
					var val2 = _g_head2.item;
					_g_head2 = _g_head2.next;
					var name2 = val2;
					var result1 = name2;
					if(name2 != null) {
						var pos1 = name2.lastIndexOf(mj_Seq.delimiter);
						if(pos1 != -1) {
							result1 = HxOverrides.substr(name2,0,pos1);
						}
					}
					var nn2 = result1;
					if(nn1 == nn2) {
						var colorName = "black";
						if(ignoreCase) {
							var _g_head3 = l.h;
							while(_g_head3 != null) {
								var val3 = _g_head3.item;
								_g_head3 = _g_head3.next;
								var p = val3;
								if(p.first.toUpperCase() == nn1.toUpperCase()) {
									colorName = p.second.toLowerCase();
									break;
								}
							}
						} else {
							var _g_head4 = l.h;
							while(_g_head4 != null) {
								var val4 = _g_head4.item;
								_g_head4 = _g_head4.next;
								var p1 = val4;
								if(p1.first == nn1) {
									colorName = p1.second.toLowerCase();
									break;
								}
							}
						}
						if(__map_reserved[colorName] != null ? map.existsReserved(colorName) : map.h.hasOwnProperty(colorName)) {
							var value = (__map_reserved[colorName] != null ? map.getReserved(colorName) : map.h[colorName]) + 1;
							if(__map_reserved[colorName] != null) {
								map.setReserved(colorName,value);
							} else {
								map.h[colorName] = value;
							}
						} else if(__map_reserved[colorName] != null) {
							map.setReserved(colorName,1);
						} else {
							map.h[colorName] = 1;
						}
					}
				}
			}
			link.strokeColorList = new List();
			var key = map.keys();
			while(key.hasNext()) {
				var key1 = key.next();
				link.strokeColorList.add(new util_Pair(key1,__map_reserved[key1] != null ? map.getReserved(key1) : map.h[key1]));
			}
		}
	}
	,generateRandomColor: function() {
		var rand = Math.random();
		var result = null;
		if(rand <= 0.0625) {
			result = "0";
		} else if(rand <= 0.125) {
			result = "1";
		} else if(rand <= 0.1875) {
			result = "2";
		} else if(rand <= 0.25) {
			result = "3";
		} else if(rand <= 0.3125) {
			result = "4";
		} else if(rand <= 0.375) {
			result = "5";
		} else if(rand <= 0.4375) {
			result = "6";
		} else if(rand <= 0.5) {
			result = "7";
		} else if(rand <= 0.5625) {
			result = "8";
		} else if(rand <= 0.625) {
			result = "9";
		} else if(rand <= 0.6875) {
			result = "A";
		} else if(rand <= 0.75) {
			result = "B";
		} else if(rand <= 0.8125) {
			result = "C";
		} else if(rand <= 0.875) {
			result = "D";
		} else if(rand <= 0.9375) {
			result = "E";
		} else {
			result = "F";
		}
		var rand1 = Math.random();
		var result1 = null;
		if(rand1 <= 0.0625) {
			result1 = "0";
		} else if(rand1 <= 0.125) {
			result1 = "1";
		} else if(rand1 <= 0.1875) {
			result1 = "2";
		} else if(rand1 <= 0.25) {
			result1 = "3";
		} else if(rand1 <= 0.3125) {
			result1 = "4";
		} else if(rand1 <= 0.375) {
			result1 = "5";
		} else if(rand1 <= 0.4375) {
			result1 = "6";
		} else if(rand1 <= 0.5) {
			result1 = "7";
		} else if(rand1 <= 0.5625) {
			result1 = "8";
		} else if(rand1 <= 0.625) {
			result1 = "9";
		} else if(rand1 <= 0.6875) {
			result1 = "A";
		} else if(rand1 <= 0.75) {
			result1 = "B";
		} else if(rand1 <= 0.8125) {
			result1 = "C";
		} else if(rand1 <= 0.875) {
			result1 = "D";
		} else if(rand1 <= 0.9375) {
			result1 = "E";
		} else {
			result1 = "F";
		}
		var rand2 = Math.random();
		var result2 = null;
		if(rand2 <= 0.0625) {
			result2 = "0";
		} else if(rand2 <= 0.125) {
			result2 = "1";
		} else if(rand2 <= 0.1875) {
			result2 = "2";
		} else if(rand2 <= 0.25) {
			result2 = "3";
		} else if(rand2 <= 0.3125) {
			result2 = "4";
		} else if(rand2 <= 0.375) {
			result2 = "5";
		} else if(rand2 <= 0.4375) {
			result2 = "6";
		} else if(rand2 <= 0.5) {
			result2 = "7";
		} else if(rand2 <= 0.5625) {
			result2 = "8";
		} else if(rand2 <= 0.625) {
			result2 = "9";
		} else if(rand2 <= 0.6875) {
			result2 = "A";
		} else if(rand2 <= 0.75) {
			result2 = "B";
		} else if(rand2 <= 0.8125) {
			result2 = "C";
		} else if(rand2 <= 0.875) {
			result2 = "D";
		} else if(rand2 <= 0.9375) {
			result2 = "E";
		} else {
			result2 = "F";
		}
		var rand3 = Math.random();
		var result3 = null;
		if(rand3 <= 0.0625) {
			result3 = "0";
		} else if(rand3 <= 0.125) {
			result3 = "1";
		} else if(rand3 <= 0.1875) {
			result3 = "2";
		} else if(rand3 <= 0.25) {
			result3 = "3";
		} else if(rand3 <= 0.3125) {
			result3 = "4";
		} else if(rand3 <= 0.375) {
			result3 = "5";
		} else if(rand3 <= 0.4375) {
			result3 = "6";
		} else if(rand3 <= 0.5) {
			result3 = "7";
		} else if(rand3 <= 0.5625) {
			result3 = "8";
		} else if(rand3 <= 0.625) {
			result3 = "9";
		} else if(rand3 <= 0.6875) {
			result3 = "A";
		} else if(rand3 <= 0.75) {
			result3 = "B";
		} else if(rand3 <= 0.8125) {
			result3 = "C";
		} else if(rand3 <= 0.875) {
			result3 = "D";
		} else if(rand3 <= 0.9375) {
			result3 = "E";
		} else {
			result3 = "F";
		}
		var rand4 = Math.random();
		var result4 = null;
		if(rand4 <= 0.0625) {
			result4 = "0";
		} else if(rand4 <= 0.125) {
			result4 = "1";
		} else if(rand4 <= 0.1875) {
			result4 = "2";
		} else if(rand4 <= 0.25) {
			result4 = "3";
		} else if(rand4 <= 0.3125) {
			result4 = "4";
		} else if(rand4 <= 0.375) {
			result4 = "5";
		} else if(rand4 <= 0.4375) {
			result4 = "6";
		} else if(rand4 <= 0.5) {
			result4 = "7";
		} else if(rand4 <= 0.5625) {
			result4 = "8";
		} else if(rand4 <= 0.625) {
			result4 = "9";
		} else if(rand4 <= 0.6875) {
			result4 = "A";
		} else if(rand4 <= 0.75) {
			result4 = "B";
		} else if(rand4 <= 0.8125) {
			result4 = "C";
		} else if(rand4 <= 0.875) {
			result4 = "D";
		} else if(rand4 <= 0.9375) {
			result4 = "E";
		} else {
			result4 = "F";
		}
		var rand5 = Math.random();
		var result5 = null;
		if(rand5 <= 0.0625) {
			result5 = "0";
		} else if(rand5 <= 0.125) {
			result5 = "1";
		} else if(rand5 <= 0.1875) {
			result5 = "2";
		} else if(rand5 <= 0.25) {
			result5 = "3";
		} else if(rand5 <= 0.3125) {
			result5 = "4";
		} else if(rand5 <= 0.375) {
			result5 = "5";
		} else if(rand5 <= 0.4375) {
			result5 = "6";
		} else if(rand5 <= 0.5) {
			result5 = "7";
		} else if(rand5 <= 0.5625) {
			result5 = "8";
		} else if(rand5 <= 0.625) {
			result5 = "9";
		} else if(rand5 <= 0.6875) {
			result5 = "A";
		} else if(rand5 <= 0.75) {
			result5 = "B";
		} else if(rand5 <= 0.8125) {
			result5 = "C";
		} else if(rand5 <= 0.875) {
			result5 = "D";
		} else if(rand5 <= 0.9375) {
			result5 = "E";
		} else {
			result5 = "F";
		}
		return "#" + result + result1 + result2 + result3 + result4 + result5;
	}
	,colorfyFFR: function(n,s) {
		var l = new List();
		l.add(new util_Pair(s,1));
		n.valid = false;
		n.pie = l;
		n.isProcessed = true;
		var _g_head = this.links.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var link = val;
			link.strokeColorList = null;
			if(link.n1 == n) {
				link.strokeColor = s;
				if(!link.n2.isProcessed) {
					this.colorfyFFR(link.n2,s);
				}
			}
			if(link.n2 == n) {
				link.strokeColor = s;
				if(!link.n1.isProcessed) {
					this.colorfyFFR(link.n1,s);
				}
			}
		}
	}
	,colorNetwork: function() {
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			node.isProcessed = false;
		}
		var _g_head1 = this.nodes.h;
		while(_g_head1 != null) {
			var val1 = _g_head1.item;
			_g_head1 = _g_head1.next;
			var node1 = val1;
			if(node1.isProcessed) {
				continue;
			}
			if(node1.node.names.length == 0) {
				var l = new List();
				l.add(new util_Pair("grey",1));
				node1.valid = false;
				node1.pie = l;
				continue;
			}
			var rand = Math.random();
			var result = null;
			if(rand <= 0.0625) {
				result = "0";
			} else if(rand <= 0.125) {
				result = "1";
			} else if(rand <= 0.1875) {
				result = "2";
			} else if(rand <= 0.25) {
				result = "3";
			} else if(rand <= 0.3125) {
				result = "4";
			} else if(rand <= 0.375) {
				result = "5";
			} else if(rand <= 0.4375) {
				result = "6";
			} else if(rand <= 0.5) {
				result = "7";
			} else if(rand <= 0.5625) {
				result = "8";
			} else if(rand <= 0.625) {
				result = "9";
			} else if(rand <= 0.6875) {
				result = "A";
			} else if(rand <= 0.75) {
				result = "B";
			} else if(rand <= 0.8125) {
				result = "C";
			} else if(rand <= 0.875) {
				result = "D";
			} else if(rand <= 0.9375) {
				result = "E";
			} else {
				result = "F";
			}
			var rand1 = Math.random();
			var result1 = null;
			if(rand1 <= 0.0625) {
				result1 = "0";
			} else if(rand1 <= 0.125) {
				result1 = "1";
			} else if(rand1 <= 0.1875) {
				result1 = "2";
			} else if(rand1 <= 0.25) {
				result1 = "3";
			} else if(rand1 <= 0.3125) {
				result1 = "4";
			} else if(rand1 <= 0.375) {
				result1 = "5";
			} else if(rand1 <= 0.4375) {
				result1 = "6";
			} else if(rand1 <= 0.5) {
				result1 = "7";
			} else if(rand1 <= 0.5625) {
				result1 = "8";
			} else if(rand1 <= 0.625) {
				result1 = "9";
			} else if(rand1 <= 0.6875) {
				result1 = "A";
			} else if(rand1 <= 0.75) {
				result1 = "B";
			} else if(rand1 <= 0.8125) {
				result1 = "C";
			} else if(rand1 <= 0.875) {
				result1 = "D";
			} else if(rand1 <= 0.9375) {
				result1 = "E";
			} else {
				result1 = "F";
			}
			var rand2 = Math.random();
			var result2 = null;
			if(rand2 <= 0.0625) {
				result2 = "0";
			} else if(rand2 <= 0.125) {
				result2 = "1";
			} else if(rand2 <= 0.1875) {
				result2 = "2";
			} else if(rand2 <= 0.25) {
				result2 = "3";
			} else if(rand2 <= 0.3125) {
				result2 = "4";
			} else if(rand2 <= 0.375) {
				result2 = "5";
			} else if(rand2 <= 0.4375) {
				result2 = "6";
			} else if(rand2 <= 0.5) {
				result2 = "7";
			} else if(rand2 <= 0.5625) {
				result2 = "8";
			} else if(rand2 <= 0.625) {
				result2 = "9";
			} else if(rand2 <= 0.6875) {
				result2 = "A";
			} else if(rand2 <= 0.75) {
				result2 = "B";
			} else if(rand2 <= 0.8125) {
				result2 = "C";
			} else if(rand2 <= 0.875) {
				result2 = "D";
			} else if(rand2 <= 0.9375) {
				result2 = "E";
			} else {
				result2 = "F";
			}
			var rand3 = Math.random();
			var result3 = null;
			if(rand3 <= 0.0625) {
				result3 = "0";
			} else if(rand3 <= 0.125) {
				result3 = "1";
			} else if(rand3 <= 0.1875) {
				result3 = "2";
			} else if(rand3 <= 0.25) {
				result3 = "3";
			} else if(rand3 <= 0.3125) {
				result3 = "4";
			} else if(rand3 <= 0.375) {
				result3 = "5";
			} else if(rand3 <= 0.4375) {
				result3 = "6";
			} else if(rand3 <= 0.5) {
				result3 = "7";
			} else if(rand3 <= 0.5625) {
				result3 = "8";
			} else if(rand3 <= 0.625) {
				result3 = "9";
			} else if(rand3 <= 0.6875) {
				result3 = "A";
			} else if(rand3 <= 0.75) {
				result3 = "B";
			} else if(rand3 <= 0.8125) {
				result3 = "C";
			} else if(rand3 <= 0.875) {
				result3 = "D";
			} else if(rand3 <= 0.9375) {
				result3 = "E";
			} else {
				result3 = "F";
			}
			var rand4 = Math.random();
			var result4 = null;
			if(rand4 <= 0.0625) {
				result4 = "0";
			} else if(rand4 <= 0.125) {
				result4 = "1";
			} else if(rand4 <= 0.1875) {
				result4 = "2";
			} else if(rand4 <= 0.25) {
				result4 = "3";
			} else if(rand4 <= 0.3125) {
				result4 = "4";
			} else if(rand4 <= 0.375) {
				result4 = "5";
			} else if(rand4 <= 0.4375) {
				result4 = "6";
			} else if(rand4 <= 0.5) {
				result4 = "7";
			} else if(rand4 <= 0.5625) {
				result4 = "8";
			} else if(rand4 <= 0.625) {
				result4 = "9";
			} else if(rand4 <= 0.6875) {
				result4 = "A";
			} else if(rand4 <= 0.75) {
				result4 = "B";
			} else if(rand4 <= 0.8125) {
				result4 = "C";
			} else if(rand4 <= 0.875) {
				result4 = "D";
			} else if(rand4 <= 0.9375) {
				result4 = "E";
			} else {
				result4 = "F";
			}
			var rand5 = Math.random();
			var result5 = null;
			if(rand5 <= 0.0625) {
				result5 = "0";
			} else if(rand5 <= 0.125) {
				result5 = "1";
			} else if(rand5 <= 0.1875) {
				result5 = "2";
			} else if(rand5 <= 0.25) {
				result5 = "3";
			} else if(rand5 <= 0.3125) {
				result5 = "4";
			} else if(rand5 <= 0.375) {
				result5 = "5";
			} else if(rand5 <= 0.4375) {
				result5 = "6";
			} else if(rand5 <= 0.5) {
				result5 = "7";
			} else if(rand5 <= 0.5625) {
				result5 = "8";
			} else if(rand5 <= 0.625) {
				result5 = "9";
			} else if(rand5 <= 0.6875) {
				result5 = "A";
			} else if(rand5 <= 0.75) {
				result5 = "B";
			} else if(rand5 <= 0.8125) {
				result5 = "C";
			} else if(rand5 <= 0.875) {
				result5 = "D";
			} else if(rand5 <= 0.9375) {
				result5 = "E";
			} else {
				result5 = "F";
			}
			this.colorfyFFR(node1,"#" + result + result1 + result2 + result3 + result4 + result5);
		}
	}
	,pieToTxt: function(pie) {
		var result = new List();
		var _g_head = pie.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var p = val;
			result.add(p.first + "\x01" + p.second);
		}
		return result.join("\x03");
	}
	,saveStyle: function() {
		var result = new List();
		var n = new List();
		n.add("A");
		n.add(this.drawCircles ? "1" : "0");
		n.add(this.drawCons ? "1" : "0");
		n.add(this.drawCurves ? "1" : "0");
		n.add(this.drawBezierPoints ? "1" : "0");
		n.add(this.drawCenter ? "1" : "0");
		n.add(this.drawAngles ? "1" : "0");
		n.add("" + this.textSize);
		result.add(n.join("\x02"));
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			var n1 = new List();
			n1.add("" + node.xPos);
			n1.add("" + node.yPos);
			n1.add("" + node.radius);
			var pie = node.pie;
			var result1 = new List();
			var _g_head1 = pie.h;
			while(_g_head1 != null) {
				var val1 = _g_head1.item;
				_g_head1 = _g_head1.next;
				var p = val1;
				result1.add(p.first + "\x01" + p.second);
			}
			n1.add(result1.join("\x03"));
			n1.add(node.strokeColor);
			n1.add("" + node.strokeWidth);
			n1.add(node.dashedArray.join("|"));
			result.add(n1.join("\x02"));
		}
		var _g_head2 = this.cons.h;
		while(_g_head2 != null) {
			var val2 = _g_head2.item;
			_g_head2 = _g_head2.next;
			var con = val2;
			var n2 = new List();
			n2.add(con.strokeColor);
			n2.add("" + con.strokeWidth);
			n2.add(con.dashedArray.join("|"));
			n2.add(con.drawMutsByLine ? "1" : "0");
			n2.add(con.drawMutsLineStrokeColor);
			n2.add("" + con.drawMutsLineWidth);
			n2.add("" + con.drawMutsLineLen);
			n2.add("" + con.drawMutsLineDashedArray.join("|"));
			n2.add(con.drawMutsByText ? "1" : "0");
			n2.add(con.drawMutsTextFont);
			n2.add("" + con.drawMutsTextSize);
			n2.add(con.drawMutsTextColor);
			n2.add("" + con.drawMutsTextPX);
			n2.add("" + con.drawMutsTextPY);
			n2.add(con.drawMutsByDots ? "1" : "0");
			n2.add("" + con.drawMutsDotsSize);
			n2.add(con.drawMutsDotsColor);
			n2.add(con.drawMutsDotsDashedArray.join("|"));
			result.add(n2.join("\x02"));
		}
		var _g_head3 = this.links.h;
		while(_g_head3 != null) {
			var val3 = _g_head3.item;
			_g_head3 = _g_head3.next;
			var link = val3;
			var n3 = new List();
			n3.add("" + link.w);
			n3.add(link.strokeColor);
			if(link.strokeColorList == null) {
				n3.add("null");
			} else {
				var x = new List();
				var _g_head4 = link.strokeColorList.h;
				while(_g_head4 != null) {
					var val4 = _g_head4.item;
					_g_head4 = _g_head4.next;
					var p1 = val4;
					if(p1 == null) {
						x.add("null");
					} else {
						x.add((p1.first == null ? "null" : p1.first) + "\x01" + (p1.second == null ? "null" : "" + p1.second));
					}
				}
				n3.add(x.join("|"));
			}
			n3.add("" + link.strokeWidth);
			n3.add(link.dashedArray.join("|"));
			n3.add("" + link.xPos);
			n3.add("" + link.yPos);
			result.add(n3.join("\x02"));
		}
		return result.join("\n");
	}
	,parsePie: function(s) {
		var result = new List();
		var _g = 0;
		var _g1 = s.split("\x03");
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			var d = p.split("\x01");
			result.add(new util_Pair(d[0],Std.parseInt(d[1])));
		}
		return result;
	}
	,loadStyle: function(style) {
		var lines = new List();
		var _g = 0;
		var _g1 = style.split("\n");
		while(_g < _g1.length) {
			var line = _g1[_g];
			++_g;
			lines.add(line);
		}
		var saveVersion = 0;
		var attrs = lines.pop().split("\x02");
		if(attrs[0] == "A") {
			saveVersion = 1;
			this.drawCircles = attrs[1] == "1";
			this.drawCons = attrs[2] == "1";
			this.drawCurves = attrs[3] == "1";
			this.drawBezierPoints = attrs[4] == "1";
			this.drawCenter = attrs[5] == "1";
			this.drawAngles = attrs[6] == "1";
			if(attrs[7] != null) {
				this.textSize = Std.parseInt(attrs[7]);
			} else {
				this.textSize = 20;
			}
		} else {
			this.drawCircles = attrs[0] == "1";
			this.drawCons = attrs[1] == "1";
			this.drawCurves = attrs[2] == "1";
			this.drawBezierPoints = attrs[3] == "1";
			this.drawCenter = attrs[4] == "1";
			this.drawAngles = attrs[5] == "1";
			if(attrs[7] != null) {
				this.textSize = Std.parseInt(attrs[7]);
			} else {
				this.textSize = 20;
			}
		}
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			var attrs1 = lines.pop().split("\x02");
			var n = parseFloat(attrs1[0]);
			node.valid = false;
			node.xPos = n;
			var n1 = parseFloat(attrs1[1]);
			node.valid = false;
			node.yPos = n1;
			var n2 = parseFloat(attrs1[2]);
			node.valid = false;
			node.radius = n2;
			var result = new List();
			var _g2 = 0;
			var _g11 = attrs1[3].split("\x03");
			while(_g2 < _g11.length) {
				var p = _g11[_g2];
				++_g2;
				var d = p.split("\x01");
				result.add(new util_Pair(d[0],Std.parseInt(d[1])));
			}
			node.valid = false;
			node.pie = result;
			node.valid = false;
			node.strokeColor = attrs1[4];
			var n3 = parseFloat(attrs1[5]);
			node.valid = false;
			node.strokeWidth = n3;
			var l = new List();
			var _g3 = 0;
			var _g12 = attrs1[6].split("|");
			while(_g3 < _g12.length) {
				var f = _g12[_g3];
				++_g3;
				if(f == "" || f == null) {
					continue;
				}
				l.add(parseFloat(f));
			}
			node.valid = false;
			node.dashedArray = l;
		}
		var _g_head1 = this.cons.h;
		while(_g_head1 != null) {
			var val1 = _g_head1.item;
			_g_head1 = _g_head1.next;
			var con = val1;
			var attrs2 = lines.pop().split("\x02");
			con.strokeColor = attrs2[0];
			if(attrs2[1] == "null") {
				con.strokeWidth = null;
			} else {
				con.strokeWidth = parseFloat(attrs2[1]);
			}
			con.dashedArray = new List();
			var _g4 = 0;
			var _g13 = attrs2[2].split("|");
			while(_g4 < _g13.length) {
				var f1 = _g13[_g4];
				++_g4;
				if(f1 == null || f1 == "") {
					continue;
				}
				con.dashedArray.add(parseFloat(f1));
			}
			con.drawMutsByLine = attrs2[3] == "1";
			con.drawMutsLineStrokeColor = attrs2[4];
			if(attrs2[5] == "null") {
				con.drawMutsLineWidth = null;
			} else {
				con.drawMutsLineWidth = parseFloat(attrs2[5]);
			}
			if(attrs2[6] == "null") {
				con.drawMutsLineLen = null;
			} else {
				con.drawMutsLineLen = parseFloat(attrs2[6]);
			}
			con.drawMutsLineDashedArray = new List();
			var _g5 = 0;
			var _g14 = attrs2[7].split("|");
			while(_g5 < _g14.length) {
				var f2 = _g14[_g5];
				++_g5;
				if(f2 == null || f2 == "") {
					continue;
				}
				con.drawMutsLineDashedArray.add(parseFloat(f2));
			}
			con.drawMutsByText = attrs2[8] == "1";
			con.drawMutsTextFont = attrs2[9];
			if(attrs2[10] == "null") {
				con.drawMutsTextSize = null;
			} else {
				con.drawMutsTextSize = parseFloat(attrs2[10]);
			}
			con.drawMutsTextColor = attrs2[11];
			if(attrs2[12] == "null") {
				con.drawMutsTextPX = null;
			} else {
				con.drawMutsTextPX = parseFloat(attrs2[12]);
			}
			if(attrs2[13] == "null") {
				con.drawMutsTextPY = null;
			} else {
				con.drawMutsTextPY = parseFloat(attrs2[13]);
			}
			con.drawMutsByDots = attrs2[14] == "1";
			if(attrs2[15] == "null") {
				con.drawMutsDotsSize = null;
			} else {
				con.drawMutsDotsSize = parseFloat(attrs2[15]);
			}
			con.drawMutsDotsColor = attrs2[16];
			con.drawMutsDotsDashedArray = new List();
			var _g6 = 0;
			var _g15 = attrs2[17].split("|");
			while(_g6 < _g15.length) {
				var f3 = _g15[_g6];
				++_g6;
				if(f3 == null || f3 == "") {
					continue;
				}
				con.drawMutsDotsDashedArray.add(parseFloat(f3));
			}
		}
		var _g_head2 = this.links.h;
		while(_g_head2 != null) {
			var val2 = _g_head2.item;
			_g_head2 = _g_head2.next;
			var link = val2;
			var attrs3 = lines.pop().split("\x02");
			link.w = parseFloat(attrs3[0]);
			link.strokeColor = attrs3[1];
			if(saveVersion == 1) {
				if(attrs3[2] == "null") {
					link.strokeColorList = null;
				} else {
					link.strokeColorList = new List();
					var _g7 = 0;
					var _g16 = attrs3[2].split("|");
					while(_g7 < _g16.length) {
						var f4 = _g16[_g7];
						++_g7;
						if(f4 == "null") {
							link.strokeColorList.add(null);
						} else if(f4 == "" || f4 == null) {
							continue;
						} else {
							var first = f4.split("\x01")[0];
							if(first == "null" || first == "") {
								first = null;
							}
							var secondStr = f4.split("\x01")[1];
							var second = null;
							if(!(secondStr == "null" || secondStr == "")) {
								second = Std.parseInt(secondStr);
							}
							var p1 = new util_Pair(first,second);
							link.strokeColorList.add(p1);
						}
					}
				}
				link.strokeWidth = parseFloat(attrs3[3]);
				link.dashedArray = new List();
				var _g8 = 0;
				var _g17 = attrs3[4].split("|");
				while(_g8 < _g17.length) {
					var f5 = _g17[_g8];
					++_g8;
					if(f5 == "" || f5 == null) {
						continue;
					}
					link.dashedArray.add(parseFloat(f5));
				}
				link.xPos = parseFloat(attrs3[5]);
				link.yPos = parseFloat(attrs3[6]);
			} else {
				link.strokeWidth = parseFloat(attrs3[2]);
				link.dashedArray = new List();
				var _g9 = 0;
				var _g18 = attrs3[3].split("|");
				while(_g9 < _g18.length) {
					var f6 = _g18[_g9];
					++_g9;
					if(f6 == "" || f6 == null) {
						continue;
					}
					link.dashedArray.add(parseFloat(f6));
				}
				link.xPos = parseFloat(attrs3[4]);
				link.yPos = parseFloat(attrs3[5]);
			}
		}
	}
	,getMinCircleSize: function() {
		var minCircleSize = Infinity;
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			minCircleSize = Math.min(minCircleSize,node.radius);
		}
		return minCircleSize;
	}
	,getMinCurveSize: function() {
		var minCurveSize = Infinity;
		var _g_head = this.links.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var link = val;
			minCurveSize = Math.min(minCurveSize,link.strokeWidth);
		}
		return minCurveSize;
	}
	,getMinLineSize: function() {
		var minLineSize = Infinity;
		var _g_head = this.cons.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var con = val;
			minLineSize = Math.min(minLineSize,con.strokeWidth);
		}
		return minLineSize;
	}
	,normalizeGraph: function() {
		var maxX = -Infinity;
		var maxY = -Infinity;
		var minX = Infinity;
		var minY = Infinity;
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			var tmp = this.drawCirclesNames;
			maxX = Math.max(maxX,node.xPos + node.radius);
			maxY = Math.max(maxY,node.yPos + node.radius);
			minX = Math.min(minX,node.xPos - node.radius);
			minY = Math.min(minY,node.yPos - node.radius);
		}
		var _g_head1 = this.links.h;
		while(_g_head1 != null) {
			var val1 = _g_head1.item;
			_g_head1 = _g_head1.next;
			var link = val1;
			var tMax = 0;
			var bX = 2 * link.xPos - (link.n1.xPos + link.n2.xPos) / 2;
			if(2 * bX - link.n1.xPos - link.n2.xPos != 0) {
				tMax = (bX - link.n1.xPos) / (2 * bX - link.n1.xPos - link.n2.xPos);
			}
			if(0 <= tMax && tMax <= 1) {
				tMax = tMax;
			} else {
				tMax = 0;
			}
			var x = (1 - tMax) * ((1 - tMax) * link.n1.xPos + tMax * bX) + tMax * ((1 - tMax) * bX + tMax * link.n2.xPos);
			var tMax1 = 0;
			var bY = 2 * link.yPos - (link.n1.yPos + link.n2.yPos) / 2;
			if(2 * bY - link.n1.yPos - link.n2.yPos != 0) {
				tMax1 = (bY - link.n1.yPos) / (2 * bY - link.n1.yPos - link.n2.yPos);
			}
			if(0 <= tMax1 && tMax1 <= 1) {
				tMax1 = tMax1;
			} else {
				tMax1 = 0;
			}
			var y = (1 - tMax1) * ((1 - tMax1) * link.n1.yPos + tMax1 * bY) + tMax1 * ((1 - tMax1) * bY + tMax1 * link.n2.yPos);
			maxX = Math.max(maxX,x);
			maxY = Math.max(maxY,y);
			minX = Math.min(minX,x);
			minY = Math.min(minY,y);
		}
		var width = maxX - minX + 200;
		var height = maxY - minY + 200;
		var sw;
		var sh;
		var minCircleSize = Infinity;
		var _g_head2 = this.nodes.h;
		while(_g_head2 != null) {
			var val2 = _g_head2.item;
			_g_head2 = _g_head2.next;
			var node1 = val2;
			minCircleSize = Math.min(minCircleSize,node1.radius);
		}
		var l = minCircleSize;
		var minSize = 3;
		sw = width / 1920 / l;
		sh = height / 1080 / l;
		var stretch = Math.max(sw,sh);
		var mstretch = 1;
		if(l * 1920 / width < 5 || l * 1080 / height < 5) {
			mstretch = Math.max(mstretch,5 * stretch);
		}
		var minLineSize = Infinity;
		var _g_head3 = this.cons.h;
		while(_g_head3 != null) {
			var val3 = _g_head3.item;
			_g_head3 = _g_head3.next;
			var con = val3;
			minLineSize = Math.min(minLineSize,con.strokeWidth);
		}
		l = minLineSize;
		if(l * 1920 / width < minSize || l * 1080 / height < minSize) {
			mstretch = Math.max(mstretch,minSize * stretch);
		}
		var minCurveSize = Infinity;
		var _g_head4 = this.links.h;
		while(_g_head4 != null) {
			var val4 = _g_head4.item;
			_g_head4 = _g_head4.next;
			var link1 = val4;
			minCurveSize = Math.min(minCurveSize,link1.strokeWidth);
		}
		l = minCurveSize;
		if(l * 1920 / width < minSize || l * 1080 / height < minSize) {
			mstretch = Math.max(mstretch,minSize * stretch);
		}
		this.modifyNodes(mstretch);
		this.modifyCons(mstretch);
		this.modifyLinks(mstretch);
	}
	,getSvgCode: function(ow,oh) {
		if(oh == null) {
			oh = -1;
		}
		if(ow == null) {
			ow = -1;
		}
		var maxX = -Infinity;
		var maxY = -Infinity;
		var minX = Infinity;
		var minY = Infinity;
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			var tmp = this.drawCirclesNames;
			maxX = Math.max(maxX,node.xPos + node.radius);
			maxY = Math.max(maxY,node.yPos + node.radius);
			minX = Math.min(minX,node.xPos - node.radius);
			minY = Math.min(minY,node.yPos - node.radius);
		}
		var _g_head1 = this.links.h;
		while(_g_head1 != null) {
			var val1 = _g_head1.item;
			_g_head1 = _g_head1.next;
			var link = val1;
			var tMax = 0;
			var bX = 2 * link.xPos - (link.n1.xPos + link.n2.xPos) / 2;
			if(2 * bX - link.n1.xPos - link.n2.xPos != 0) {
				tMax = (bX - link.n1.xPos) / (2 * bX - link.n1.xPos - link.n2.xPos);
			}
			if(0 <= tMax && tMax <= 1) {
				tMax = tMax;
			} else {
				tMax = 0;
			}
			var x = (1 - tMax) * ((1 - tMax) * link.n1.xPos + tMax * bX) + tMax * ((1 - tMax) * bX + tMax * link.n2.xPos);
			var tMax1 = 0;
			var bY = 2 * link.yPos - (link.n1.yPos + link.n2.yPos) / 2;
			if(2 * bY - link.n1.yPos - link.n2.yPos != 0) {
				tMax1 = (bY - link.n1.yPos) / (2 * bY - link.n1.yPos - link.n2.yPos);
			}
			if(0 <= tMax1 && tMax1 <= 1) {
				tMax1 = tMax1;
			} else {
				tMax1 = 0;
			}
			var y = (1 - tMax1) * ((1 - tMax1) * link.n1.yPos + tMax1 * bY) + tMax1 * ((1 - tMax1) * bY + tMax1 * link.n2.yPos);
			maxX = Math.max(maxX,x);
			maxY = Math.max(maxY,y);
			minX = Math.min(minX,x);
			minY = Math.min(minY,y);
		}
		var width = maxX - minX + 200;
		var height = maxY - minY + 200;
		var f1 = ow / width;
		if(ow == -1) {
			f1 = 1;
		}
		var f2 = oh / height;
		if(oh == -1) {
			f2 = 1;
		}
		this.lastStretchFact = Math.min(f1,f2);
		ow = width * this.lastStretchFact;
		oh = height * this.lastStretchFact;
		var result = new List();
		result.add("<svg version='1.1' baseProfile='full' width='" + ow);
		result.add("' height='" + oh);
		result.add("' viewBox='" + (minX - 100) + "," + (minY - 100) + "," + width + "," + height + "' xmlns='http://www.w3.org/2000/svg'>");
		if(this.drawCons) {
			var _g_head2 = this.cons.h;
			while(_g_head2 != null) {
				var val2 = _g_head2.item;
				_g_head2 = _g_head2.next;
				var con = val2;
				var result1 = new List();
				result1.add("<line x1='");
				result1.add(con.n1.xPos + "' y1='");
				result1.add(con.n1.yPos + "' x2='");
				result1.add(con.n2.xPos + "' y2='");
				result1.add(con.n2.yPos + "' stroke='");
				result1.add(con.strokeColor + "' stroke-width='");
				result1.add(con.strokeWidth + "' ");
				if(!con.dashedArray.isEmpty()) {
					result1.add("stroke-dasharray='");
					result1.add(con.dashedArray.join(","));
					result1.add("' ");
				}
				result1.add("/>");
				if(con.drawMutsByLine || con.drawMutsByText || con.drawMutsByDots) {
					var vX = con.n1.xPos - con.n2.xPos;
					var vY = con.n1.yPos - con.n2.yPos;
					var vL = Math.sqrt(vX * vX + vY * vY);
					var eVX = vX / vL;
					var eVY = vY / vL;
					var startX = con.n2.xPos + eVX * con.n2.radius;
					var startY = con.n2.yPos + eVY * con.n2.radius;
					var endX = con.n2.xPos + vX - eVX * con.n1.radius;
					var endY = con.n2.yPos + vY - eVY * con.n1.radius;
					vX = (endX - startX) / (con.l.length + 1);
					vY = (endY - startY) / (con.l.length + 1);
					var iii = 0;
					var _g_head3 = con.l.h;
					while(_g_head3 != null) {
						var val3 = _g_head3.item;
						_g_head3 = _g_head3.next;
						var text = val3;
						++iii;
						var x1 = startX + vX * iii;
						var y1 = startY + vY * iii;
						if(con.drawMutsByDots) {
							result1.add("<circle cx='");
							result1.add(x1 + "' cy='");
							result1.add(y1 + "' r='");
							result1.add(con.drawMutsDotsSize + "' fill='");
							result1.add(con.drawMutsDotsColor);
							if(!con.drawMutsDotsDashedArray.isEmpty()) {
								result1.add("' stroke-dasharray='");
								result1.add(con.drawMutsDotsDashedArray.join(","));
								result1.add("'");
							}
							result1.add("/>");
						}
						if(con.drawMutsByLine) {
							var x11 = x1 - eVY * con.drawMutsLineLen;
							var y11 = y1 + eVX * con.drawMutsLineLen;
							var x2 = x1 + eVY * con.drawMutsLineLen;
							var y2 = y1 - eVX * con.drawMutsLineLen;
							result1.add("<line x1='");
							result1.add(x11 + "' y1='");
							result1.add(y11 + "' x2='");
							result1.add(x2 + "' y2='");
							result1.add(y2 + "' stroke='");
							result1.add(con.drawMutsLineStrokeColor + "' stroke-width='");
							result1.add(con.drawMutsLineWidth + "'");
							if(!con.drawMutsLineDashedArray.isEmpty()) {
								result1.add(" stroke-dasharray='");
								result1.add(con.drawMutsLineDashedArray.join(","));
								result1.add("'");
							}
							result1.add("/>");
						}
						if(con.drawMutsByText) {
							result1.add("<text x='");
							result1.add(x1 + con.drawMutsTextPX + "' y='");
							result1.add(y1 + con.drawMutsTextSize / 2 + con.drawMutsTextPY + "' fill='");
							result1.add(con.drawMutsTextColor + "' font-family='");
							result1.add(con.drawMutsTextFont + "' font-size='");
							result1.add(con.drawMutsTextSize + "'");
							result1.add(">" + text + "</text>");
						}
					}
				}
				result.add(result1.join(""));
			}
		}
		if(this.drawCurves) {
			result.add("<g fill='none'>");
			var _g_head4 = this.links.h;
			while(_g_head4 != null) {
				var val4 = _g_head4.item;
				_g_head4 = _g_head4.next;
				var link1 = val4;
				var result2 = new List();
				if(link1.strokeColorList == null || link1.strokeColorList.isEmpty()) {
					result2.add("<path d='M");
					result2.add(link1.n1.xPos + " ");
					result2.add(link1.n1.yPos + " Q");
					result2.add(" " + (2 * link1.xPos - (link1.n1.xPos + link1.n2.xPos) / 2));
					result2.add(" " + (2 * link1.yPos - (link1.n1.yPos + link1.n2.yPos) / 2));
					result2.add(" " + link1.n2.xPos);
					result2.add(" " + link1.n2.yPos);
					result2.add("' stroke='");
					if(link1.strokeColor == null) {
						haxe_Log.trace("WRN: Use black instead of null as strokecolor",{ fileName : "Link.hx", lineNumber : 71, className : "draw.Link", methodName : "getLinkSvg"});
						result2.add("black");
					} else {
						result2.add(link1.strokeColor);
					}
					result2.add("' stroke-width='");
					result2.add(link1.strokeWidth + "' ");
					if(!link1.dashedArray.isEmpty()) {
						result2.add("stroke-dasharray='");
						result2.add(link1.dashedArray.join(","));
						result2.add("' ");
					}
					result2.add("/>");
				} else {
					var b00X = -2 * (link1.xPos - link1.n1.xPos);
					var b00Y = -2 * (link1.yPos - link1.n1.yPos);
					var b10X = -2 * (link1.n2.xPos - link1.xPos);
					var b10Y = -2 * (link1.n2.yPos - link1.yPos);
					var b05X = b00X + b10X;
					var b05Y = b00Y + b10Y;
					var v00X = b00Y;
					var v00Y = -b00X;
					var l00 = Math.sqrt(v00X * v00X + v00Y * v00Y);
					v00X /= l00;
					v00Y /= l00;
					var v10X = b10Y;
					var v10Y = -b10X;
					var l10 = Math.sqrt(v10X * v10X + v10Y * v10Y);
					v10X /= l10;
					v10Y /= l10;
					var v05X = b05Y;
					var v05Y = -b05X;
					var l05 = Math.sqrt(v05X * v05X + v05Y * v05Y);
					v05X /= l05;
					v05Y /= l05;
					var sum = 0;
					var _g_head5 = link1.strokeColorList.h;
					while(_g_head5 != null) {
						var val5 = _g_head5.item;
						_g_head5 = _g_head5.next;
						var p = val5;
						sum += p.second;
					}
					var dSum = 0;
					var factor = link1.strokeWidth / sum;
					var _g_head6 = link1.strokeColorList.h;
					while(_g_head6 != null) {
						var val6 = _g_head6.item;
						_g_head6 = _g_head6.next;
						var p1 = val6;
						var c = p1.first;
						var d = p1.second;
						var l = ((sum - d) / 2 - dSum) * factor;
						dSum += d;
						result2.add("<path d='M");
						result2.add(link1.n1.xPos + v00X * l + " ");
						result2.add(link1.n1.yPos + v00Y * l + " Q");
						result2.add(" " + (2 * (link1.xPos + v05X * l) - (link1.n1.xPos + v00X * l + (link1.n2.xPos + v10X * l)) / 2));
						result2.add(" " + (2 * (link1.yPos + v05Y * l) - (link1.n1.yPos + v00Y * l + (link1.n2.yPos + v10Y * l)) / 2));
						result2.add(" " + (link1.n2.xPos + v10X * l));
						result2.add(" " + (link1.n2.yPos + v10Y * l));
						result2.add("' stroke='");
						if(c == null) {
							haxe_Log.trace("WRN: Use black instead of null as strokecolor",{ fileName : "Link.hx", lineNumber : 128, className : "draw.Link", methodName : "getLinkSvg"});
							result2.add("black");
						} else {
							result2.add(c);
						}
						result2.add("' stroke-width='");
						result2.add(d * factor + "' ");
						if(!link1.dashedArray.isEmpty()) {
							result2.add("stroke-dasharray='");
							result2.add(link1.dashedArray.join(","));
							result2.add("' ");
						}
						result2.add("/>");
					}
				}
				result.add(result2.join(""));
			}
			result.add("</g>");
		}
		if(this.drawLoops) {
			var _g_head7 = this.nodes.h;
			while(_g_head7 != null) {
				var val7 = _g_head7.item;
				_g_head7 = _g_head7.next;
				var node1 = val7;
				var n = 0;
				var map = new haxe_ds_StringMap();
				var _g_head8 = node1.node.names.h;
				while(_g_head8 != null) {
					var val8 = _g_head8.item;
					_g_head8 = _g_head8.next;
					var name = val8;
					var result3 = name;
					if(name != null) {
						var pos = name.lastIndexOf(mj_Seq.delimiter);
						if(pos != -1) {
							result3 = HxOverrides.substr(name,0,pos);
						}
					}
					var indName = result3;
					if(__map_reserved[indName] != null ? map.existsReserved(indName) : map.h.hasOwnProperty(indName)) {
						if((__map_reserved[indName] != null ? map.getReserved(indName) : map.h[indName]) == 0) {
							if(__map_reserved[indName] != null) {
								map.setReserved(indName,1);
							} else {
								map.h[indName] = 1;
							}
							++n;
						}
					} else if(__map_reserved[indName] != null) {
						map.setReserved(indName,0);
					} else {
						map.h[indName] = 0;
					}
				}
				haxe_Log.trace("XXX " + n + " " + node1.xPos + " " + node1.yPos,{ fileName : "NodePos.hx", lineNumber : 246, className : "draw.NodePos", methodName : "getLoopSvg"});
				var tmp1;
				if(n == 0) {
					tmp1 = "";
				} else {
					var l1 = Math.sqrt(node1.xPos * node1.xPos + node1.yPos * node1.yPos);
					var x3;
					var y3;
					if(l1 < 0.1) {
						x3 = node1.xPos + node1.radius / 1.414213562;
						y3 = node1.yPos + node1.radius / 1.414213562;
					} else {
						x3 = node1.xPos + node1.xPos / l1 * node1.radius;
						y3 = node1.yPos + node1.yPos / l1 * node1.radius;
					}
					tmp1 = "<circle cx='" + x3 + "' cy='" + y3 + "' r='" + node1.radius + "' stroke-width='" + n + "' stroke='black' fill='none'/>";
				}
				result.add(tmp1);
			}
		}
		if(this.drawCircles) {
			var _g_head9 = this.nodes.h;
			while(_g_head9 != null) {
				var val9 = _g_head9.item;
				_g_head9 = _g_head9.next;
				var node2 = val9;
				var tmp2;
				if(!this.drawCirclesMedians && node2.node.type != parsing_SEQ_$TYPE.SAMPLED_SEQUENCE) {
					tmp2 = "";
				} else if(node2.valid) {
					tmp2 = node2.svg;
				} else {
					var result4 = new List();
					node2.pie = node2.pie.filter(function(t) {
						if(t.first != null && t.first != "") {
							return t.second > 0;
						} else {
							return false;
						}
					});
					var needArcs = false;
					result4.add("<circle id='");
					result4.add("n" + node2.node.id);
					result4.add("' ");
					result4.add("stroke='");
					result4.add(node2.strokeColor);
					result4.add("' ");
					result4.add("stroke-width='");
					result4.add("" + node2.strokeWidth);
					result4.add("' ");
					if(!node2.dashedArray.isEmpty()) {
						result4.add("stroke-dasharray='");
						result4.add(node2.dashedArray.join(","));
						result4.add("' ");
					}
					result4.add("cx='");
					result4.add("" + node2.xPos);
					result4.add("' ");
					result4.add("cy='");
					result4.add("" + node2.yPos);
					result4.add("' ");
					result4.add("r='");
					result4.add("" + node2.radius);
					result4.add("' ");
					if(node2.pie.isEmpty()) {
						result4.add("fill='black'");
					} else if(node2.pie.length == 1) {
						result4.add("fill='");
						result4.add(node2.pie.first().first);
						result4.add("' ");
					} else {
						needArcs = true;
					}
					result4.add("/>");
					if(needArcs) {
						var summe = 0;
						var _g_head10 = node2.pie.h;
						while(_g_head10 != null) {
							var val10 = _g_head10.item;
							_g_head10 = _g_head10.next;
							var p2 = val10;
							summe += p2.second;
						}
						var cs = 0;
						var _g_head11 = node2.pie.h;
						while(_g_head11 != null) {
							var val11 = _g_head11.item;
							_g_head11 = _g_head11.next;
							var p3 = val11;
							var color = p3.first;
							var perc = p3.second / summe;
							var pX1 = Math.sin(cs / summe * 2 * Math.PI) * node2.radius + node2.xPos;
							var pY1 = -Math.cos(cs / summe * 2 * Math.PI) * node2.radius + node2.yPos;
							cs += p3.second;
							var pX2 = Math.sin(cs / summe * 2 * Math.PI) * node2.radius + node2.xPos;
							var pY2 = -Math.cos(cs / summe * 2 * Math.PI) * node2.radius + node2.yPos;
							var arcFlag = perc < 0.5 ? 0 : 1;
							result4.add("<path fill='" + color + "' d='M" + node2.xPos + "," + node2.yPos + "L" + pX1 + "," + pY1 + "A" + node2.radius + "," + node2.radius + " 1 " + arcFlag + ",1 " + pX2 + ", " + pY2 + " z'/>");
						}
					}
					node2.svg = result4.join("");
					node2.valid = true;
					tmp2 = node2.svg;
				}
				result.add(tmp2);
			}
		}
		if(this.drawCirclesNames) {
			result.add("<g font-size=\"" + this.textSize + "px\" font-family=\"Times\">");
			var _g_head12 = this.nodes.h;
			while(_g_head12 != null) {
				var val12 = _g_head12.item;
				_g_head12 = _g_head12.next;
				var node3 = val12;
				var tmp3;
				if(node3.node.type != parsing_SEQ_$TYPE.SAMPLED_SEQUENCE) {
					tmp3 = "";
				} else {
					var x4 = node3.xPos + node3.radius + 5;
					var y4 = node3.yPos + node3.radius + 5;
					tmp3 = "<text x='" + x4 + "' y='" + y4 + "'>" + node3.node.names.first() + "</text>";
				}
				result.add(tmp3);
			}
			result.add("</g>");
		}
		if(this.drawAngles) {
			var _g_head13 = this.cons.h;
			while(_g_head13 != null) {
				var val13 = _g_head13.item;
				_g_head13 = _g_head13.next;
				var c1 = val13;
				var _g_head14 = this.cons.h;
				while(_g_head14 != null) {
					var val14 = _g_head14.item;
					_g_head14 = _g_head14.next;
					var c2 = val14;
					if(c1.id > c2.id) {
						var nA = null;
						var nB = null;
						var nC = null;
						if(c1.n1 == c2.n1) {
							nA = c1.n2;
							nB = c2.n2;
							nC = c1.n1;
						} else if(c1.n1 == c2.n2) {
							nA = c1.n2;
							nB = c2.n1;
							nC = c1.n1;
						} else if(c1.n2 == c2.n1) {
							nA = c1.n1;
							nB = c2.n2;
							nC = c1.n2;
						} else if(c1.n2 == c2.n2) {
							nA = c1.n1;
							nB = c2.n1;
							nC = c1.n2;
						}
						if(nC != null) {
							var v1X = nA.xPos - nC.xPos;
							var v1Y = nA.yPos - nC.yPos;
							var v2X = nB.xPos - nC.xPos;
							var v2Y = nB.yPos - nC.yPos;
							var l11 = Math.sqrt(v1X * v1X + v1Y * v1Y);
							var l2 = Math.sqrt(v2X * v2X + v2Y * v2Y);
							var c3 = v1X * v2X + v1Y * v2Y;
							var wXV = v1X / l11 + v2X / l2;
							var wYV = v1Y / l11 + v2Y / l2;
							var wL = Math.sqrt(wXV * wXV + wYV * wYV);
							var xx = nC.xPos + wXV / wL * (nC.radius + 20);
							var yy = nC.yPos + wYV / wL * (nC.radius + 20);
							var txt = HxOverrides.substr("" + Math.acos(c3 / (l11 * l2)) * 360 / (2 * Math.PI),0,6);
							result.add("<text x='" + xx + "' y='" + yy + "' text-anchor='middle'>" + txt + "</text>");
						}
					}
				}
			}
		}
		if(this.drawBezierPoints) {
			var _g_head15 = this.links.h;
			while(_g_head15 != null) {
				var val15 = _g_head15.item;
				_g_head15 = _g_head15.next;
				var link2 = val15;
				result.add("<circle cx='" + link2.xPos + "' cy='" + link2.yPos + "' r='5' fill='" + link2.strokeColor + "' stroke='" + (link2.setByUser ? "black" : "red") + "' />");
			}
		}
		if(this.drawCenter) {
			var rx = 0;
			var _g_head16 = this.nodes.h;
			while(_g_head16 != null) {
				var val16 = _g_head16.item;
				_g_head16 = _g_head16.next;
				var node4 = val16;
				rx += node4.xPos;
			}
			var x5 = rx / this.nodes.length;
			var ry = 0;
			var _g_head17 = this.nodes.h;
			while(_g_head17 != null) {
				var val17 = _g_head17.item;
				_g_head17 = _g_head17.next;
				var node5 = val17;
				ry += node5.yPos;
			}
			var y5 = ry / this.nodes.length;
			result.add("<line x1='" + x5 + "' y1='" + minY + "' x2='" + x5 + "' y2='" + maxY + "' stroke='green' stroke-dasharray='3 3' />");
			result.add("<line x1='" + minX + "' y1='" + y5 + "' x2='" + maxX + "' y2='" + y5 + "' stroke='green' stroke-dasharray='3 3' />");
			var rx1 = 0;
			var _g_head18 = this.nodes.h;
			while(_g_head18 != null) {
				var val18 = _g_head18.item;
				_g_head18 = _g_head18.next;
				var node6 = val18;
				rx1 += node6.xPos;
			}
			var tmp4 = "<circle cx='" + rx1 / this.nodes.length + "' cy='";
			var ry1 = 0;
			var _g_head19 = this.nodes.h;
			while(_g_head19 != null) {
				var val19 = _g_head19.item;
				_g_head19 = _g_head19.next;
				var node7 = val19;
				ry1 += node7.yPos;
			}
			result.add(tmp4 + ry1 / this.nodes.length + "' r='5' fill='green' />");
		}
		result.add("</svg>");
		return result.join("");
	}
	,assignLinkPos: function(overwriteUser) {
		if(overwriteUser == null) {
			overwriteUser = true;
		}
		var l = new List();
		var _g_head = this.links.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var link = val;
			if(!overwriteUser && link.setByUser) {
				continue;
			} else {
				link.xPos = NaN;
				link.yPos = NaN;
				link.setByUser = false;
				var vX = link.n1.xPos - link.n2.xPos;
				var vY = link.n1.yPos - link.n2.yPos;
				var vrX = -vY / 8;
				var vrY = vX / 8;
				var mX = link.n2.xPos + vX / 2;
				var mY = link.n2.yPos + vY / 2;
				link.x1 = mX - vrX;
				link.y1 = mY - vrY;
				link.x2 = mX + vrX;
				link.y2 = mY + vrY;
				link.e1 = 0;
				link.e2 = 0;
				var _g_head1 = this.nodes.h;
				while(_g_head1 != null) {
					var val1 = _g_head1.item;
					_g_head1 = _g_head1.next;
					var node = val1;
					var dX = node.xPos - link.x1;
					var dY = node.yPos - link.y1;
					link.e1 += 1 / Math.sqrt(dX * dX + dY * dY);
					var dX1 = node.xPos - link.x2;
					var dY1 = node.yPos - link.y2;
					link.e2 += 1 / Math.sqrt(dX1 * dX1 + dY1 * dY1);
				}
				if(!overwriteUser) {
					var _g_head2 = this.links.h;
					while(_g_head2 != null) {
						var val2 = _g_head2.item;
						_g_head2 = _g_head2.next;
						var link2 = val2;
						if(link2.setByUser) {
							var dX2 = link2.xPos - link.x1;
							var dY2 = link2.yPos - link.y1;
							link.e1 += 1 / Math.sqrt(dX2 * dX2 + dY2 * dY2);
							var dX3 = link2.xPos - link.x2;
							var dY3 = link2.yPos - link.y2;
							link.e2 += 1 / Math.sqrt(dX3 * dX3 + dY3 * dY3);
						}
					}
				}
				l.add(link);
			}
		}
		while(!l.isEmpty()) {
			var bestEDiff = -1.0;
			var bestLink = null;
			var _g_head3 = l.h;
			while(_g_head3 != null) {
				var val3 = _g_head3.item;
				_g_head3 = _g_head3.next;
				var link1 = val3;
				var eDiff = Math.abs(link1.e1 - link1.e2);
				if(eDiff > bestEDiff || bestEDiff == -1) {
					bestEDiff = eDiff;
					bestLink = link1;
				}
			}
			bestLink.xPos = bestLink.e1 < bestLink.e2 ? bestLink.x1 : bestLink.x2;
			bestLink.yPos = bestLink.e1 < bestLink.e2 ? bestLink.y1 : bestLink.y2;
			l.remove(bestLink);
			var _g_head4 = l.h;
			while(_g_head4 != null) {
				var val4 = _g_head4.item;
				_g_head4 = _g_head4.next;
				var link3 = val4;
				var dX4 = bestLink.xPos - link3.x1;
				var dY4 = bestLink.yPos - link3.y1;
				link3.e1 += 1 / Math.sqrt(dX4 * dX4 + dY4 * dY4);
				var dX5 = bestLink.xPos - link3.x2;
				var dY5 = bestLink.yPos - link3.y2;
				link3.e2 += 1 / Math.sqrt(dX5 * dX5 + dY5 * dY5);
			}
		}
	}
	,assignRandomNodePos: function() {
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			var n = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
			node.valid = false;
			node.xPos = n;
			var n1 = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
			node.valid = false;
			node.yPos = n1;
		}
		var _g_head1 = this.nodes.h;
		while(_g_head1 != null) {
			var val1 = _g_head1.item;
			_g_head1 = _g_head1.next;
			var node1 = val1;
			var needCheck = true;
			while(needCheck) {
				needCheck = false;
				var _g_head2 = this.nodes.h;
				while(_g_head2 != null) {
					var val2 = _g_head2.item;
					_g_head2 = _g_head2.next;
					var node2 = val2;
					if(node1.node.id > node2.node.id && node1.xPos == node2.xPos && node2.yPos == node2.yPos) {
						var n2 = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
						node1.valid = false;
						node1.xPos = n2;
						var n3 = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
						node1.valid = false;
						node1.yPos = n3;
						needCheck = true;
						break;
					}
				}
			}
		}
	}
	,checkNoNodeAtSamePoint: function() {
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node1 = val;
			var needCheck = true;
			while(needCheck) {
				needCheck = false;
				var _g_head1 = this.nodes.h;
				while(_g_head1 != null) {
					var val1 = _g_head1.item;
					_g_head1 = _g_head1.next;
					var node2 = val1;
					if(node1.node.id > node2.node.id && node1.xPos == node2.xPos && node2.yPos == node2.yPos) {
						var n = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
						node1.valid = false;
						node1.xPos = n;
						var n1 = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
						node1.valid = false;
						node1.yPos = n1;
						needCheck = true;
						break;
					}
				}
			}
		}
	}
	,calcCenterX: function() {
		var rx = 0;
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			rx += node.xPos;
		}
		return rx / this.nodes.length;
	}
	,calcCenterY: function() {
		var ry = 0;
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			ry += node.yPos;
		}
		return ry / this.nodes.length;
	}
	,centerPos: function() {
		var rx = 0;
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			rx += node.xPos;
		}
		var cx = rx / this.nodes.length;
		var ry = 0;
		var _g_head1 = this.nodes.h;
		while(_g_head1 != null) {
			var val1 = _g_head1.item;
			_g_head1 = _g_head1.next;
			var node1 = val1;
			ry += node1.yPos;
		}
		var cy = ry / this.nodes.length;
		var _g_head2 = this.nodes.h;
		while(_g_head2 != null) {
			var val2 = _g_head2.item;
			_g_head2 = _g_head2.next;
			var node2 = val2;
			node2.valid = false;
			node2.xPos -= cx;
			node2.valid = false;
			node2.yPos -= cy;
		}
	}
	,stretch: function(fact) {
		var rx = 0;
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			rx += node.xPos;
		}
		var cx = rx / this.nodes.length;
		var ry = 0;
		var _g_head1 = this.nodes.h;
		while(_g_head1 != null) {
			var val1 = _g_head1.item;
			_g_head1 = _g_head1.next;
			var node1 = val1;
			ry += node1.yPos;
		}
		var cy = ry / this.nodes.length;
		var _g_head2 = this.nodes.h;
		while(_g_head2 != null) {
			var val2 = _g_head2.item;
			_g_head2 = _g_head2.next;
			var node2 = val2;
			node2.valid = false;
			node2.xPos -= cx;
			node2.valid = false;
			node2.yPos -= cy;
		}
		var rx1 = 0;
		var _g_head3 = this.nodes.h;
		while(_g_head3 != null) {
			var val3 = _g_head3.item;
			_g_head3 = _g_head3.next;
			var node3 = val3;
			rx1 += node3.xPos;
		}
		var cx1 = rx1 / this.nodes.length;
		var ry1 = 0;
		var _g_head4 = this.nodes.h;
		while(_g_head4 != null) {
			var val4 = _g_head4.item;
			_g_head4 = _g_head4.next;
			var node4 = val4;
			ry1 += node4.yPos;
		}
		var cy1 = ry1 / this.nodes.length;
		var _g_head5 = this.nodes.h;
		while(_g_head5 != null) {
			var val5 = _g_head5.item;
			_g_head5 = _g_head5.next;
			var node5 = val5;
			var vX = node5.xPos - cx1;
			var vY = node5.yPos - cy1;
			vX *= fact;
			vY *= fact;
			node5.valid = false;
			node5.xPos = cx1 + vX;
			node5.valid = false;
			node5.yPos = cy1 + vY;
		}
	}
	,mult_radius: function(v) {
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			if(node.node.type == parsing_SEQ_$TYPE.SAMPLED_SEQUENCE) {
				node.valid = false;
				node.radius *= v;
			}
		}
	}
	,mirrorX: function() {
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			var vX = -node.xPos;
			var vY = node.yPos;
			node.valid = false;
			node.xPos = vX;
			node.valid = false;
			node.yPos = vY;
		}
		var _g_head1 = this.links.h;
		while(_g_head1 != null) {
			var val1 = _g_head1.item;
			_g_head1 = _g_head1.next;
			var link = val1;
			var vX1 = -link.xPos;
			var vY1 = link.yPos;
			link.xPos = vX1;
			link.yPos = vY1;
		}
	}
	,mirrorY: function() {
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			var vX = node.xPos;
			var vY = -node.yPos;
			node.valid = false;
			node.xPos = vX;
			node.valid = false;
			node.yPos = vY;
		}
		var _g_head1 = this.links.h;
		while(_g_head1 != null) {
			var val1 = _g_head1.item;
			_g_head1 = _g_head1.next;
			var link = val1;
			var vX1 = link.xPos;
			var vY1 = -link.yPos;
			link.xPos = vX1;
			link.yPos = vY1;
		}
	}
	,rotateP90: function() {
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			var vX = -node.yPos;
			var vY = node.xPos;
			node.valid = false;
			node.xPos = vX;
			node.valid = false;
			node.yPos = vY;
		}
		var _g_head1 = this.links.h;
		while(_g_head1 != null) {
			var val1 = _g_head1.item;
			_g_head1 = _g_head1.next;
			var link = val1;
			var vX1 = -link.yPos;
			var vY1 = link.xPos;
			link.xPos = vX1;
			link.yPos = vY1;
		}
	}
	,rotateN90: function() {
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			var vX = node.yPos;
			var vY = -node.xPos;
			node.valid = false;
			node.xPos = vX;
			node.valid = false;
			node.yPos = vY;
		}
		var _g_head1 = this.links.h;
		while(_g_head1 != null) {
			var val1 = _g_head1.item;
			_g_head1 = _g_head1.next;
			var link = val1;
			var vX1 = link.yPos;
			var vY1 = -link.xPos;
			link.xPos = vX1;
			link.yPos = vY1;
		}
	}
	,rotate: function(angle) {
		var rx = 0;
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node = val;
			rx += node.xPos;
		}
		var cx = rx / this.nodes.length;
		var ry = 0;
		var _g_head1 = this.nodes.h;
		while(_g_head1 != null) {
			var val1 = _g_head1.item;
			_g_head1 = _g_head1.next;
			var node1 = val1;
			ry += node1.yPos;
		}
		var cy = ry / this.nodes.length;
		var _g_head2 = this.nodes.h;
		while(_g_head2 != null) {
			var val2 = _g_head2.item;
			_g_head2 = _g_head2.next;
			var node2 = val2;
			node2.valid = false;
			node2.xPos -= cx;
			node2.valid = false;
			node2.yPos -= cy;
		}
		var cosA = Math.cos(angle);
		var sinA = Math.sin(angle);
		var _g_head3 = this.nodes.h;
		while(_g_head3 != null) {
			var val3 = _g_head3.item;
			_g_head3 = _g_head3.next;
			var node3 = val3;
			var vX = node3.xPos * cosA - node3.yPos * sinA;
			var vY = node3.xPos * sinA + node3.yPos * cosA;
			node3.valid = false;
			node3.xPos = vX;
			node3.valid = false;
			node3.yPos = vY;
		}
		var _g_head4 = this.links.h;
		while(_g_head4 != null) {
			var val4 = _g_head4.item;
			_g_head4 = _g_head4.next;
			var link = val4;
			var vX1 = link.xPos * cosA - link.yPos * sinA;
			var vY1 = link.xPos * sinA + link.yPos * cosA;
			link.xPos = vX1;
			link.yPos = vY1;
		}
		var rx1 = 0;
		var _g_head5 = this.nodes.h;
		while(_g_head5 != null) {
			var val5 = _g_head5.item;
			_g_head5 = _g_head5.next;
			var node4 = val5;
			rx1 += node4.xPos;
		}
		var cx1 = rx1 / this.nodes.length;
		var ry1 = 0;
		var _g_head6 = this.nodes.h;
		while(_g_head6 != null) {
			var val6 = _g_head6.item;
			_g_head6 = _g_head6.next;
			var node5 = val6;
			ry1 += node5.yPos;
		}
		var cy1 = ry1 / this.nodes.length;
		var _g_head7 = this.nodes.h;
		while(_g_head7 != null) {
			var val7 = _g_head7.item;
			_g_head7 = _g_head7.next;
			var node6 = val7;
			node6.valid = false;
			node6.xPos -= cx1;
			node6.valid = false;
			node6.yPos -= cy1;
		}
	}
	,fluct: function() {
		return 10 * Math.random() * (Math.random() > 0.5 ? 1 : -1);
	}
	,forceDirectedMethod: function(setRandomInitial,damping,smE,kn,ks,kc,steps,remVelocity) {
		if(remVelocity == null) {
			remVelocity = true;
		}
		if(steps == null) {
			steps = 1000;
		}
		if(kc == null) {
			kc = 5.0;
		}
		if(ks == null) {
			ks = 0.2;
		}
		if(kn == null) {
			kn = 1.0;
		}
		if(setRandomInitial) {
			var _g_head = this.nodes.h;
			while(_g_head != null) {
				var val = _g_head.item;
				_g_head = _g_head.next;
				var node = val;
				var n = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
				node.valid = false;
				node.xPos = n;
				var n1 = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
				node.valid = false;
				node.yPos = n1;
			}
			var _g_head1 = this.nodes.h;
			while(_g_head1 != null) {
				var val1 = _g_head1.item;
				_g_head1 = _g_head1.next;
				var node1 = val1;
				var needCheck = true;
				while(needCheck) {
					needCheck = false;
					var _g_head2 = this.nodes.h;
					while(_g_head2 != null) {
						var val2 = _g_head2.item;
						_g_head2 = _g_head2.next;
						var node2 = val2;
						if(node1.node.id > node2.node.id && node1.xPos == node2.xPos && node2.yPos == node2.yPos) {
							var n2 = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
							node1.valid = false;
							node1.xPos = n2;
							var n3 = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
							node1.valid = false;
							node1.yPos = n3;
							needCheck = true;
							break;
						}
					}
				}
			}
		} else {
			var _g_head3 = this.nodes.h;
			while(_g_head3 != null) {
				var val3 = _g_head3.item;
				_g_head3 = _g_head3.next;
				var node11 = val3;
				var needCheck1 = true;
				while(needCheck1) {
					needCheck1 = false;
					var _g_head4 = this.nodes.h;
					while(_g_head4 != null) {
						var val4 = _g_head4.item;
						_g_head4 = _g_head4.next;
						var node21 = val4;
						if(node11.node.id > node21.node.id && node11.xPos == node21.xPos && node21.yPos == node21.yPos) {
							var n4 = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
							node11.valid = false;
							node11.xPos = n4;
							var n5 = (Math.random() > 0.5 ? -1 : 1) * 1000 * Math.random();
							node11.valid = false;
							node11.yPos = n5;
							needCheck1 = true;
							break;
						}
					}
				}
			}
		}
		if(remVelocity) {
			var _g_head5 = this.nodes.h;
			while(_g_head5 != null) {
				var val5 = _g_head5.item;
				_g_head5 = _g_head5.next;
				var node3 = val5;
				node3.velocityX = 0;
				node3.velocityY = 0;
			}
		}
		var tE = 0;
		var xDif;
		var yDif;
		var r;
		var stepCount = 0;
		var stopCritSteps;
		while(true) {
			++stepCount;
			stopCritSteps = false;
			tE = 0;
			var _g_head6 = this.nodes.h;
			while(_g_head6 != null) {
				var val6 = _g_head6.item;
				_g_head6 = _g_head6.next;
				var node4 = val6;
				node4.forceX = 0;
				node4.forceY = 0;
				var _g_head7 = this.nodes.h;
				while(_g_head7 != null) {
					var val7 = _g_head7.item;
					_g_head7 = _g_head7.next;
					var oNode = val7;
					if(node4 != oNode) {
						xDif = node4.xPos - oNode.xPos;
						yDif = node4.yPos - oNode.yPos;
						r = Math.sqrt(xDif * xDif + yDif * yDif);
						if(r > 1) {
							node4.forceX += kn * xDif / (r * r);
							node4.forceY += kn * yDif / (r * r);
						} else {
							r += 0.1;
							node4.forceX += kn * (xDif + 10 * Math.random() * (Math.random() > 0.5 ? 1 : -1)) / (r * r);
							node4.forceY += kn * (yDif + 10 * Math.random() * (Math.random() > 0.5 ? 1 : -1)) / (r * r);
						}
					}
				}
				var _g_head8 = this.cons.h;
				while(_g_head8 != null) {
					var val8 = _g_head8.item;
					_g_head8 = _g_head8.next;
					var con = val8;
					if(con.n1 == node4) {
						xDif = con.n2.xPos - con.n1.xPos;
						yDif = con.n2.yPos - con.n1.yPos;
					} else if(con.n2 == node4) {
						xDif = con.n1.xPos - con.n2.xPos;
						yDif = con.n1.yPos - con.n2.yPos;
					} else {
						continue;
					}
					r = Math.sqrt(xDif * xDif + yDif * yDif);
					var displacement = r - con.expLength;
					xDif /= r;
					yDif /= r;
					node4.forceX += ks * displacement * xDif;
					node4.forceY += ks * displacement * yDif;
				}
			}
			var _g_head9 = this.nodes.h;
			while(_g_head9 != null) {
				var val9 = _g_head9.item;
				_g_head9 = _g_head9.next;
				var node5 = val9;
				node5.velocityX = (node5.velocityX + node5.forceX) * damping;
				node5.velocityY = (node5.velocityY + node5.forceY) * damping;
				node5.valid = false;
				node5.xPos += node5.velocityX;
				node5.valid = false;
				node5.yPos += node5.velocityY;
				var l = Math.sqrt(node5.velocityX * node5.velocityX + node5.velocityY * node5.velocityY);
				tE += l * l;
			}
			if(stepCount > steps && steps > -1) {
				stopCritSteps = true;
			}
			if(!(tE > smE && !stopCritSteps)) {
				break;
			}
		}
		return tE;
	}
	,modifyLinks: function(f) {
		var _g_head = this.links.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var l = val;
			l.strokeWidth *= f;
		}
	}
	,modifyCons: function(f) {
		var _g_head = this.cons.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var c = val;
			c.strokeWidth *= f;
		}
	}
	,modifyNodes: function(f) {
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var n = val;
			n.valid = false;
			n.radius = f * n.radius;
		}
	}
	,resetLinkColors: function(color) {
		var _g_head = this.links.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var l = val;
			l.strokeColor = color;
		}
	}
	,calculateEnergy: function() {
		var result = 0;
		var _g_head = this.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var node1 = val;
			var _g_head1 = this.nodes.h;
			while(_g_head1 != null) {
				var val1 = _g_head1.item;
				_g_head1 = _g_head1.next;
				var node2 = val1;
				if(node1.node.id > node2.node.id) {
					var dX = node1.xPos - node2.xPos;
					var dY = node1.yPos - node2.yPos;
					result += 1.0 / Math.sqrt(dX * dX + dY * dY);
				}
			}
		}
		var _g_head2 = this.cons.h;
		while(_g_head2 != null) {
			var val2 = _g_head2.item;
			_g_head2 = _g_head2.next;
			var con = val2;
			var expDist = con.expLength;
			var dX1 = con.n1.xPos - con.n2.xPos;
			var dY1 = con.n1.yPos - con.n2.yPos;
			var rDist = Math.sqrt(dX1 * dX1 + dY1 * dY1);
			var diff = expDist - rDist;
			result += diff * diff;
		}
		return result;
	}
	,__class__: draw_Graph
};
var draw_Link = function(n1,n2,w) {
	this.strokeColorList = null;
	this.n1 = n1;
	this.n2 = n2;
	if(draw_NodePos.areaShouldBePropTo == draw_SIZE_$TO_$RADIUS.CONST) {
		this.w = 5;
		this.strokeWidth = 5;
	} else {
		this.w = w;
		this.strokeWidth = w;
	}
	this.strokeColor = "#000";
	this.dashedArray = new List();
	this.setByUser = false;
};
$hxClasses["draw.Link"] = draw_Link;
draw_Link.__name__ = ["draw","Link"];
draw_Link.prototype = {
	n1: null
	,n2: null
	,w: null
	,strokeColor: null
	,strokeColorList: null
	,strokeWidth: null
	,dashedArray: null
	,xPos: null
	,yPos: null
	,x1: null
	,y1: null
	,x2: null
	,y2: null
	,e1: null
	,e2: null
	,setByUser: null
	,set_xPos: function(n) {
		this.xPos = n;
	}
	,set_yPos: function(n) {
		this.yPos = n;
	}
	,calcCurve: function(a,b,c,t) {
		return (1 - t) * ((1 - t) * a + t * b) + t * ((1 - t) * b + t * c);
	}
	,calcCPoint: function(a,b,c) {
		return 2 * b - (a + c) / 2;
	}
	,getLinkSvg: function() {
		var result = new List();
		if(this.strokeColorList == null || this.strokeColorList.isEmpty()) {
			result.add("<path d='M");
			result.add(this.n1.xPos + " ");
			result.add(this.n1.yPos + " Q");
			result.add(" " + (2 * this.xPos - (this.n1.xPos + this.n2.xPos) / 2));
			result.add(" " + (2 * this.yPos - (this.n1.yPos + this.n2.yPos) / 2));
			result.add(" " + this.n2.xPos);
			result.add(" " + this.n2.yPos);
			result.add("' stroke='");
			if(this.strokeColor == null) {
				haxe_Log.trace("WRN: Use black instead of null as strokecolor",{ fileName : "Link.hx", lineNumber : 71, className : "draw.Link", methodName : "getLinkSvg"});
				result.add("black");
			} else {
				result.add(this.strokeColor);
			}
			result.add("' stroke-width='");
			result.add(this.strokeWidth + "' ");
			if(!this.dashedArray.isEmpty()) {
				result.add("stroke-dasharray='");
				result.add(this.dashedArray.join(","));
				result.add("' ");
			}
			result.add("/>");
		} else {
			var b00X = -2 * (this.xPos - this.n1.xPos);
			var b00Y = -2 * (this.yPos - this.n1.yPos);
			var b10X = -2 * (this.n2.xPos - this.xPos);
			var b10Y = -2 * (this.n2.yPos - this.yPos);
			var b05X = b00X + b10X;
			var b05Y = b00Y + b10Y;
			var v00X = b00Y;
			var v00Y = -b00X;
			var l00 = Math.sqrt(v00X * v00X + v00Y * v00Y);
			v00X /= l00;
			v00Y /= l00;
			var v10X = b10Y;
			var v10Y = -b10X;
			var l10 = Math.sqrt(v10X * v10X + v10Y * v10Y);
			v10X /= l10;
			v10Y /= l10;
			var v05X = b05Y;
			var v05Y = -b05X;
			var l05 = Math.sqrt(v05X * v05X + v05Y * v05Y);
			v05X /= l05;
			v05Y /= l05;
			var sum = 0;
			var _g_head = this.strokeColorList.h;
			while(_g_head != null) {
				var val = _g_head.item;
				_g_head = _g_head.next;
				var p = val;
				sum += p.second;
			}
			var dSum = 0;
			var factor = this.strokeWidth / sum;
			var _g_head1 = this.strokeColorList.h;
			while(_g_head1 != null) {
				var val1 = _g_head1.item;
				_g_head1 = _g_head1.next;
				var p1 = val1;
				var c = p1.first;
				var d = p1.second;
				var l = ((sum - d) / 2 - dSum) * factor;
				dSum += d;
				result.add("<path d='M");
				result.add(this.n1.xPos + v00X * l + " ");
				result.add(this.n1.yPos + v00Y * l + " Q");
				result.add(" " + (2 * (this.xPos + v05X * l) - (this.n1.xPos + v00X * l + (this.n2.xPos + v10X * l)) / 2));
				result.add(" " + (2 * (this.yPos + v05Y * l) - (this.n1.yPos + v00Y * l + (this.n2.yPos + v10Y * l)) / 2));
				result.add(" " + (this.n2.xPos + v10X * l));
				result.add(" " + (this.n2.yPos + v10Y * l));
				result.add("' stroke='");
				if(c == null) {
					haxe_Log.trace("WRN: Use black instead of null as strokecolor",{ fileName : "Link.hx", lineNumber : 128, className : "draw.Link", methodName : "getLinkSvg"});
					result.add("black");
				} else {
					result.add(c);
				}
				result.add("' stroke-width='");
				result.add(d * factor + "' ");
				if(!this.dashedArray.isEmpty()) {
					result.add("stroke-dasharray='");
					result.add(this.dashedArray.join(","));
					result.add("' ");
				}
				result.add("/>");
			}
		}
		return result.join("");
	}
	,getMMX: function() {
		var tMax = 0;
		var bX = 2 * this.xPos - (this.n1.xPos + this.n2.xPos) / 2;
		if(2 * bX - this.n1.xPos - this.n2.xPos != 0) {
			tMax = (bX - this.n1.xPos) / (2 * bX - this.n1.xPos - this.n2.xPos);
		}
		if(0 <= tMax && tMax <= 1) {
			tMax = tMax;
		} else {
			tMax = 0;
		}
		return (1 - tMax) * ((1 - tMax) * this.n1.xPos + tMax * bX) + tMax * ((1 - tMax) * bX + tMax * this.n2.xPos);
	}
	,getMMY: function() {
		var tMax = 0;
		var bY = 2 * this.yPos - (this.n1.yPos + this.n2.yPos) / 2;
		if(2 * bY - this.n1.yPos - this.n2.yPos != 0) {
			tMax = (bY - this.n1.yPos) / (2 * bY - this.n1.yPos - this.n2.yPos);
		}
		if(0 <= tMax && tMax <= 1) {
			tMax = tMax;
		} else {
			tMax = 0;
		}
		return (1 - tMax) * ((1 - tMax) * this.n1.yPos + tMax * bY) + tMax * ((1 - tMax) * bY + tMax * this.n2.yPos);
	}
	,__class__: draw_Link
};
var draw_SIZE_$TO_$RADIUS = $hxClasses["draw.SIZE_TO_RADIUS"] = { __ename__ : ["draw","SIZE_TO_RADIUS"], __constructs__ : ["CONST","SQRT","LIN"] };
draw_SIZE_$TO_$RADIUS.CONST = ["CONST",0];
draw_SIZE_$TO_$RADIUS.CONST.toString = $estr;
draw_SIZE_$TO_$RADIUS.CONST.__enum__ = draw_SIZE_$TO_$RADIUS;
draw_SIZE_$TO_$RADIUS.SQRT = ["SQRT",1];
draw_SIZE_$TO_$RADIUS.SQRT.toString = $estr;
draw_SIZE_$TO_$RADIUS.SQRT.__enum__ = draw_SIZE_$TO_$RADIUS;
draw_SIZE_$TO_$RADIUS.LIN = ["LIN",2];
draw_SIZE_$TO_$RADIUS.LIN.toString = $estr;
draw_SIZE_$TO_$RADIUS.LIN.__enum__ = draw_SIZE_$TO_$RADIUS;
draw_SIZE_$TO_$RADIUS.__empty_constructs__ = [draw_SIZE_$TO_$RADIUS.CONST,draw_SIZE_$TO_$RADIUS.SQRT,draw_SIZE_$TO_$RADIUS.LIN];
var draw_NodePos = function(n,graph) {
	this.graph = graph;
	this.valid = false;
	this.pie = new List();
	this.node = n;
	if(draw_NodePos.areaShouldBePropTo == draw_SIZE_$TO_$RADIUS.CONST) {
		this.radius = 15;
	} else if(draw_NodePos.areaShouldBePropTo == draw_SIZE_$TO_$RADIUS.SQRT) {
		this.radius = 3 + Math.sqrt(this.node.names.length);
	} else if(draw_NodePos.areaShouldBePropTo == draw_SIZE_$TO_$RADIUS.LIN) {
		this.radius = 3 + this.node.names.length;
	}
	if(this.node.type == parsing_SEQ_$TYPE.MEDIAN_VECTOR) {
		this.strokeColor = "grey";
		this.strokeWidth = 1;
		this.radius = 3;
	} else {
		this.strokeColor = "black";
		this.strokeWidth = 1;
	}
	this.dashedArray = new List();
};
$hxClasses["draw.NodePos"] = draw_NodePos;
draw_NodePos.__name__ = ["draw","NodePos"];
draw_NodePos.set_areaShouldBePropTo = function(s) {
	if(s == "AREA") {
		draw_NodePos.areaShouldBePropTo = draw_SIZE_$TO_$RADIUS.SQRT;
	} else if(s == "Const") {
		draw_NodePos.areaShouldBePropTo = draw_SIZE_$TO_$RADIUS.CONST;
	} else if(s == "Radius") {
		draw_NodePos.areaShouldBePropTo = draw_SIZE_$TO_$RADIUS.LIN;
	} else {
		haxe_Log.trace("Not understood!",{ fileName : "NodePos.hx", lineNumber : 24, className : "draw.NodePos", methodName : "set_areaShouldBePropTo"});
	}
};
draw_NodePos.prototype = {
	node: null
	,xPos: null
	,yPos: null
	,radius: null
	,pie: null
	,strokeColor: null
	,strokeWidth: null
	,dashedArray: null
	,velocityX: null
	,velocityY: null
	,forceX: null
	,forceY: null
	,isProcessed: null
	,valid: null
	,svg: null
	,graph: null
	,set_xPos: function(n) {
		this.valid = false;
		this.xPos = n;
	}
	,set_yPos: function(n) {
		this.valid = false;
		this.yPos = n;
	}
	,mult_radius: function(v) {
		this.valid = false;
		this.radius = v * this.radius;
	}
	,set_radius: function(n) {
		this.valid = false;
		this.radius = n;
	}
	,set_pie: function(n) {
		this.valid = false;
		this.pie = n;
	}
	,set_pieByArrays: function(n1,n2) {
		if(n1.length != n2.length) {
			throw new js__$Boot_HaxeError("n1 and n2 differ in size!");
		}
		var l = new List();
		var _g1 = 0;
		var _g = n1.length;
		while(_g1 < _g) {
			var i = _g1++;
			l.add(new util_Pair(n1[i],n2[i]));
		}
		this.valid = false;
		this.pie = l;
	}
	,set_color: function(s) {
		var l = new List();
		l.add(new util_Pair(s,1));
		this.valid = false;
		this.pie = l;
	}
	,set_pieByLst: function(l,ignoreCase,byIndNameOnly) {
		var l_ = new List();
		var warnings = new List();
		var _g_head = this.node.names.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var name = val;
			if(byIndNameOnly) {
				var result = name;
				if(name != null) {
					var pos = name.lastIndexOf(mj_Seq.delimiter);
					if(pos != -1) {
						result = HxOverrides.substr(name,0,pos);
					}
				}
				name = result;
			}
			var colorName = null;
			var _g_head1 = l.h;
			while(_g_head1 != null) {
				var val1 = _g_head1.item;
				_g_head1 = _g_head1.next;
				var p = val1;
				if(ignoreCase) {
					if(p.first.toUpperCase() == name.toUpperCase()) {
						colorName = p.second.toLowerCase();
						break;
					}
				} else if(p.first == name) {
					colorName = p.second.toLowerCase();
					break;
				}
			}
			if(colorName == null) {
				haxe_Log.trace("No colorname found for individual '" + name + "'!",{ fileName : "NodePos.hx", lineNumber : 106, className : "draw.NodePos", methodName : "set_pieByLst"});
				warnings.add(name);
				colorName = "black";
			}
			var found = false;
			var _g_head2 = l_.h;
			while(_g_head2 != null) {
				var val2 = _g_head2.item;
				_g_head2 = _g_head2.next;
				var p1 = val2;
				if(p1.first == colorName) {
					p1.second++;
					found = true;
					break;
				}
			}
			if(!found) {
				l_.add(new util_Pair(colorName,1));
			}
		}
		this.valid = false;
		this.pie = l_;
		return warnings.join(",");
	}
	,set_strokeColor: function(n) {
		this.valid = false;
		this.strokeColor = n;
	}
	,set_strokeWidth: function(n) {
		this.valid = false;
		this.strokeWidth = n;
	}
	,set_dashedArray: function(n) {
		this.valid = false;
		this.dashedArray = n;
	}
	,getNodeSvg: function(drawMeds) {
		if(drawMeds == null) {
			drawMeds = true;
		}
		if(!drawMeds && this.node.type != parsing_SEQ_$TYPE.SAMPLED_SEQUENCE) {
			return "";
		}
		if(this.valid) {
			return this.svg;
		}
		var result = new List();
		this.pie = this.pie.filter(function(t) {
			if(t.first != null && t.first != "") {
				return t.second > 0;
			} else {
				return false;
			}
		});
		var needArcs = false;
		result.add("<circle id='");
		result.add("n" + this.node.id);
		result.add("' ");
		result.add("stroke='");
		result.add(this.strokeColor);
		result.add("' ");
		result.add("stroke-width='");
		result.add("" + this.strokeWidth);
		result.add("' ");
		if(!this.dashedArray.isEmpty()) {
			result.add("stroke-dasharray='");
			result.add(this.dashedArray.join(","));
			result.add("' ");
		}
		result.add("cx='");
		result.add("" + this.xPos);
		result.add("' ");
		result.add("cy='");
		result.add("" + this.yPos);
		result.add("' ");
		result.add("r='");
		result.add("" + this.radius);
		result.add("' ");
		if(this.pie.isEmpty()) {
			result.add("fill='black'");
		} else if(this.pie.length == 1) {
			result.add("fill='");
			result.add(this.pie.first().first);
			result.add("' ");
		} else {
			needArcs = true;
		}
		result.add("/>");
		if(needArcs) {
			var summe = 0;
			var _g_head = this.pie.h;
			while(_g_head != null) {
				var val = _g_head.item;
				_g_head = _g_head.next;
				var p = val;
				summe += p.second;
			}
			var cs = 0;
			var _g_head1 = this.pie.h;
			while(_g_head1 != null) {
				var val1 = _g_head1.item;
				_g_head1 = _g_head1.next;
				var p1 = val1;
				var color = p1.first;
				var perc = p1.second / summe;
				var pX1 = Math.sin(cs / summe * 2 * Math.PI) * this.radius + this.xPos;
				var pY1 = -Math.cos(cs / summe * 2 * Math.PI) * this.radius + this.yPos;
				cs += p1.second;
				var pX2 = Math.sin(cs / summe * 2 * Math.PI) * this.radius + this.xPos;
				var pY2 = -Math.cos(cs / summe * 2 * Math.PI) * this.radius + this.yPos;
				var arcFlag = perc < 0.5 ? 0 : 1;
				result.add("<path fill='" + color + "' d='M" + this.xPos + "," + this.yPos + "L" + pX1 + "," + pY1 + "A" + this.radius + "," + this.radius + " 1 " + arcFlag + ",1 " + pX2 + ", " + pY2 + " z'/>");
			}
		}
		this.svg = result.join("");
		this.valid = true;
		return this.svg;
	}
	,getLoopSvg: function() {
		var n = 0;
		var map = new haxe_ds_StringMap();
		var _g_head = this.node.names.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var name = val;
			var result = name;
			if(name != null) {
				var pos = name.lastIndexOf(mj_Seq.delimiter);
				if(pos != -1) {
					result = HxOverrides.substr(name,0,pos);
				}
			}
			var indName = result;
			if(__map_reserved[indName] != null ? map.existsReserved(indName) : map.h.hasOwnProperty(indName)) {
				if((__map_reserved[indName] != null ? map.getReserved(indName) : map.h[indName]) == 0) {
					if(__map_reserved[indName] != null) {
						map.setReserved(indName,1);
					} else {
						map.h[indName] = 1;
					}
					++n;
				}
			} else if(__map_reserved[indName] != null) {
				map.setReserved(indName,0);
			} else {
				map.h[indName] = 0;
			}
		}
		haxe_Log.trace("XXX " + n + " " + this.xPos + " " + this.yPos,{ fileName : "NodePos.hx", lineNumber : 246, className : "draw.NodePos", methodName : "getLoopSvg"});
		if(n == 0) {
			return "";
		}
		var l = Math.sqrt(this.xPos * this.xPos + this.yPos * this.yPos);
		var x;
		var y;
		if(l < 0.1) {
			x = this.xPos + this.radius / 1.414213562;
			y = this.yPos + this.radius / 1.414213562;
		} else {
			x = this.xPos + this.xPos / l * this.radius;
			y = this.yPos + this.yPos / l * this.radius;
		}
		return "<circle cx='" + x + "' cy='" + y + "' r='" + this.radius + "' stroke-width='" + n + "' stroke='black' fill='none'/>";
	}
	,getNodeNameSvg: function() {
		if(this.node.type != parsing_SEQ_$TYPE.SAMPLED_SEQUENCE) {
			return "";
		}
		var x = this.xPos + this.radius + 5;
		var y = this.yPos + this.radius + 5;
		return "<text x='" + x + "' y='" + y + "'>" + this.node.names.first() + "</text>";
	}
	,minX: function() {
		return this.xPos - this.radius;
	}
	,maxX: function() {
		return this.xPos + this.radius;
	}
	,minY: function() {
		return this.yPos - this.radius;
	}
	,maxY: function() {
		return this.yPos + this.radius;
	}
	,containsInd: function(ind,pos) {
		var _g_head = pos.node.names.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var name = val;
			var result = name;
			if(name != null) {
				var pos1 = name.lastIndexOf(mj_Seq.delimiter);
				if(pos1 != -1) {
					result = HxOverrides.substr(name,0,pos1);
				}
			}
			var nameS = result;
			if(nameS == ind) {
				return true;
			}
		}
		return false;
	}
	,getColor: function(ind) {
		var _g_head = this.graph.nodes.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var c = val;
			if(c == this) {
				continue;
			}
			if(this.containsInd(ind,c)) {
				return "blue";
			}
		}
		return "black";
	}
	,getDivContent: function() {
		var result = "<table style='width:100%'>";
		result += "<tr><td>Id</td><td>" + this.node.id + "</td></tr>";
		result += "<tr><td>SpId</td><td>" + this.node.spId + "</td></tr>";
		result += "<tr><td>Names</td><td>";
		var blueColored = 0;
		var sepOut = false;
		var difNames = new haxe_ds_StringMap();
		var difInd = 0;
		var difNames2 = new haxe_ds_StringMap();
		var difInd2 = 0;
		var _g_head = this.node.names.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var name = val;
			if(sepOut) {
				result += "; ";
			}
			var result1 = name;
			if(name != null) {
				var pos = name.lastIndexOf(mj_Seq.delimiter);
				if(pos != -1) {
					result1 = HxOverrides.substr(name,0,pos);
				}
			}
			var nameS = result1;
			var color = this.getColor(nameS);
			if(color == "blue") {
				++blueColored;
				if(!(__map_reserved[nameS] != null ? difNames2.existsReserved(nameS) : difNames2.h.hasOwnProperty(nameS))) {
					++difInd2;
					if(__map_reserved[nameS] != null) {
						difNames2.setReserved(nameS,true);
					} else {
						difNames2.h[nameS] = true;
					}
				}
			}
			if(!(__map_reserved[nameS] != null ? difNames.existsReserved(nameS) : difNames.h.hasOwnProperty(nameS))) {
				++difInd;
				if(__map_reserved[nameS] != null) {
					difNames.setReserved(nameS,true);
				} else {
					difNames.h[nameS] = true;
				}
			}
			result += "<span style='color:" + color + "'>" + name + "</span>";
			sepOut = true;
		}
		result += "</td></tr>";
		result += "<tr><td colspan='2' style='font-size: small'>Sequences of heterozygous individuals are shown in blue.</td></tr>";
		result += "</table>";
		return result;
	}
	,__class__: draw_NodePos
};
var haxe_IMap = function() { };
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = ["haxe","IMap"];
haxe_IMap.prototype = {
	get: null
	,set: null
	,exists: null
	,remove: null
	,keys: null
	,iterator: null
	,toString: null
	,__class__: haxe_IMap
};
var haxe_Log = function() { };
$hxClasses["haxe.Log"] = haxe_Log;
haxe_Log.__name__ = ["haxe","Log"];
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
haxe_Log.clear = function() {
	js_Boot.__clear_trace();
};
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
$hxClasses["haxe.ds._StringMap.StringMapIterator"] = haxe_ds__$StringMap_StringMapIterator;
haxe_ds__$StringMap_StringMapIterator.__name__ = ["haxe","ds","_StringMap","StringMapIterator"];
haxe_ds__$StringMap_StringMapIterator.prototype = {
	map: null
	,keys: null
	,index: null
	,count: null
	,hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		var _this = this.map;
		var key = this.keys[this.index++];
		if(__map_reserved[key] != null) {
			return _this.getReserved(key);
		} else {
			return _this.h[key];
		}
	}
	,__class__: haxe_ds__$StringMap_StringMapIterator
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	h: null
	,rh: null
	,isReserved: function(key) {
		return __map_reserved[key] != null;
	}
	,set: function(key,value) {
		if(__map_reserved[key] != null) {
			this.setReserved(key,value);
		} else {
			this.h[key] = value;
		}
	}
	,get: function(key) {
		if(__map_reserved[key] != null) {
			return this.getReserved(key);
		}
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) {
			return this.existsReserved(key);
		}
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) {
			this.rh = { };
		}
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) {
			return null;
		} else {
			return this.rh["$" + key];
		}
	}
	,existsReserved: function(key) {
		if(this.rh == null) {
			return false;
		}
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) {
				return false;
			}
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) {
				return false;
			}
			delete(this.h[key]);
			return true;
		}
	}
	,keys: function() {
		return HxOverrides.iter(this.arrayKeys());
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) {
			out.push(key);
		}
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) {
				out.push(key.substr(1));
			}
			}
		}
		return out;
	}
	,iterator: function() {
		return new haxe_ds__$StringMap_StringMapIterator(this,this.arrayKeys());
	}
	,toString: function() {
		var s_b = "";
		s_b += "{";
		var keys = this.arrayKeys();
		var _g1 = 0;
		var _g = keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			var k = keys[i];
			s_b += k == null ? "null" : "" + k;
			s_b += " => ";
			s_b += Std.string(Std.string(__map_reserved[k] != null ? this.getReserved(k) : this.h[k]));
			if(i < keys.length - 1) {
				s_b += ", ";
			}
		}
		s_b += "}";
		return s_b;
	}
	,__class__: haxe_ds_StringMap
};
var haxe_ds__$Vector_Vector_$Impl_$ = {};
$hxClasses["haxe.ds._Vector.Vector_Impl_"] = haxe_ds__$Vector_Vector_$Impl_$;
haxe_ds__$Vector_Vector_$Impl_$.__name__ = ["haxe","ds","_Vector","Vector_Impl_"];
haxe_ds__$Vector_Vector_$Impl_$.__properties__ = {get_length:"get_length"};
haxe_ds__$Vector_Vector_$Impl_$._new = function(length) {
	var this1 = new Array(length);
	return this1;
};
haxe_ds__$Vector_Vector_$Impl_$.get = function(this1,index) {
	return this1[index];
};
haxe_ds__$Vector_Vector_$Impl_$.set = function(this1,index,val) {
	return this1[index] = val;
};
haxe_ds__$Vector_Vector_$Impl_$.get_length = function(this1) {
	return this1.length;
};
haxe_ds__$Vector_Vector_$Impl_$.blit = function(src,srcPos,dest,destPos,len) {
	if(src == dest) {
		if(srcPos < destPos) {
			var i = srcPos + len;
			var j = destPos + len;
			var _g1 = 0;
			var _g = len;
			while(_g1 < _g) {
				var k = _g1++;
				--i;
				--j;
				src[j] = src[i];
			}
		} else if(srcPos > destPos) {
			var i1 = srcPos;
			var j1 = destPos;
			var _g11 = 0;
			var _g2 = len;
			while(_g11 < _g2) {
				var k1 = _g11++;
				src[j1] = src[i1];
				++i1;
				++j1;
			}
		}
	} else {
		var _g12 = 0;
		var _g3 = len;
		while(_g12 < _g3) {
			var i2 = _g12++;
			dest[destPos + i2] = src[srcPos + i2];
		}
	}
};
haxe_ds__$Vector_Vector_$Impl_$.toArray = function(this1) {
	return this1.slice(0);
};
haxe_ds__$Vector_Vector_$Impl_$.toData = function(this1) {
	return this1;
};
haxe_ds__$Vector_Vector_$Impl_$.fromData = function(data) {
	return data;
};
haxe_ds__$Vector_Vector_$Impl_$.fromArrayCopy = function(array) {
	return array.slice(0);
};
haxe_ds__$Vector_Vector_$Impl_$.copy = function(this1) {
	var length = this1.length;
	var this2 = new Array(length);
	var r = this2;
	haxe_ds__$Vector_Vector_$Impl_$.blit(this1,0,r,0,this1.length);
	return r;
};
haxe_ds__$Vector_Vector_$Impl_$.join = function(this1,sep) {
	var b_b = "";
	var i = 0;
	var len = this1.length;
	var _g1 = 0;
	var _g = len;
	while(_g1 < _g) {
		var i1 = _g1++;
		b_b += Std.string(Std.string(this1[i1]));
		if(i1 < len - 1) {
			b_b += sep == null ? "null" : "" + sep;
		}
	}
	return b_b;
};
haxe_ds__$Vector_Vector_$Impl_$.map = function(this1,f) {
	var length = this1.length;
	var this2 = new Array(length);
	var r = this2;
	var i = 0;
	var len = length;
	var _g1 = 0;
	var _g = len;
	while(_g1 < _g) {
		var i1 = _g1++;
		var v = f(this1[i1]);
		r[i1] = v;
	}
	return r;
};
haxe_ds__$Vector_Vector_$Impl_$.sort = function(this1,f) {
	this1.sort(f);
};
var interfaces_Printer = function() {
	this.indent = "  ";
	this.newline = "\n";
	this.countingOffset = 1;
};
$hxClasses["interfaces.Printer"] = interfaces_Printer;
interfaces_Printer.__name__ = ["interfaces","Printer"];
interfaces_Printer.prototype = {
	countingOffset: null
	,newline: null
	,indent: null
	,printString: null
	,close: null
	,__class__: interfaces_Printer
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) {
		Error.captureStackTrace(this,js__$Boot_HaxeError);
	}
};
$hxClasses["js._Boot.HaxeError"] = js__$Boot_HaxeError;
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.wrap = function(val) {
	if((val instanceof Error)) {
		return val;
	} else {
		return new js__$Boot_HaxeError(val);
	}
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	val: null
	,__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = ["js","Boot"];
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg = i != null ? i.fileName + ":" + i.lineNumber + ": " : "";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	var tmp;
	if(typeof(document) != "undefined") {
		d = document.getElementById("haxe:trace");
		tmp = d != null;
	} else {
		tmp = false;
	}
	if(tmp) {
		d.innerHTML += js_Boot.__unhtml(msg) + "<br/>";
	} else if(typeof console != "undefined" && console.log != null) {
		console.log(msg);
	}
};
js_Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) {
		d.innerHTML = "";
	}
};
js_Boot.isClass = function(o) {
	return o.__name__;
};
js_Boot.isEnum = function(e) {
	return e.__ename__;
};
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) {
					return o[0];
				}
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) {
						str += "," + js_Boot.__string_rec(o[i],s);
					} else {
						str += js_Boot.__string_rec(o[i],s);
					}
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g11 = 0;
			var _g2 = l;
			while(_g11 < _g2) {
				var i2 = _g11++;
				str1 += (i2 > 0 ? "," : "") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) {
			str2 += ", \n";
		}
		str2 += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) {
		return false;
	}
	if(cc == cl) {
		return true;
	}
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) {
				return true;
			}
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) {
		return false;
	}
	switch(cl) {
	case Array:
		if((o instanceof Array)) {
			return o.__enum__ == null;
		} else {
			return false;
		}
		break;
	case Bool:
		return typeof(o) == "boolean";
	case Dynamic:
		return true;
	case Float:
		return typeof(o) == "number";
	case Int:
		if(typeof(o) == "number") {
			return (o|0) === o;
		} else {
			return false;
		}
		break;
	case String:
		return typeof(o) == "string";
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					return true;
				}
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) {
					return true;
				}
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) {
					return true;
				}
			}
		} else {
			return false;
		}
		if(cl == Class ? o.__name__ != null : false) {
			return true;
		}
		if(cl == Enum ? o.__ename__ != null : false) {
			return true;
		}
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) {
		return o;
	} else {
		throw new js__$Boot_HaxeError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_Lib = function() { };
$hxClasses["js.Lib"] = js_Lib;
js_Lib.__name__ = ["js","Lib"];
js_Lib.__properties__ = {get_undefined:"get_undefined"};
js_Lib.debug = function() {
	debugger;
};
js_Lib.alert = function(v) {
	alert(js_Boot.__string_rec(v,""));
};
js_Lib["eval"] = function(code) {
	return eval(code);
};
js_Lib.get_undefined = function() {
	return undefined;
};
var mj_Connection = function(conT,dist) {
	this.connectedTo = conT;
	this.dist = dist;
};
$hxClasses["mj.Connection"] = mj_Connection;
mj_Connection.__name__ = ["mj","Connection"];
mj_Connection.prototype = {
	next: null
	,connectedTo: null
	,dist: null
	,__class__: mj_Connection
};
var mj_Link = function() {
};
$hxClasses["mj.Link"] = mj_Link;
mj_Link.__name__ = ["mj","Link"];
mj_Link.prototype = {
	to: null
	,names: null
	,countInd: function() {
		return this.names.length;
	}
	,__class__: mj_Link
};
var mj_Seq = function() {
	this.names = new List();
	this.indNames = new List();
	this.linkedTo = new List();
	this.spId = 0;
};
$hxClasses["mj.Seq"] = mj_Seq;
mj_Seq.__name__ = ["mj","Seq"];
mj_Seq.calcHash = function(s) {
	var result = 7;
	var _g1 = 0;
	var _g = s.length;
	while(_g1 < _g) {
		var pos = _g1++;
		result = 31 * result + HxOverrides.cca(s,pos);
	}
	return result;
};
mj_Seq.getIndIdentifier = function(s) {
	var result = s;
	if(s != null) {
		var pos = s.lastIndexOf(mj_Seq.delimiter);
		if(pos != -1) {
			result = HxOverrides.substr(s,0,pos);
		}
	}
	return result;
};
mj_Seq.createSample = function(id,name,seq) {
	var result = new mj_Seq();
	result.id = id;
	if(name != null && name != "") {
		result.names.add(name);
		var result1 = name;
		if(name != null) {
			var pos = name.lastIndexOf(mj_Seq.delimiter);
			if(pos != -1) {
				result1 = HxOverrides.substr(name,0,pos);
			}
		}
		var indId = result1;
		var result2 = false;
		var _g_head = result.indNames.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var indName = val;
			if(indName == indId) {
				result2 = true;
				break;
			}
		}
		if(!result2) {
			result.indNames.add(indId);
		}
	}
	result.origSeq = seq;
	var s = result.origSeq;
	var result3 = 7;
	var _g1 = 0;
	var _g = s.length;
	while(_g1 < _g) {
		var pos1 = _g1++;
		result3 = 31 * result3 + HxOverrides.cca(s,pos1);
	}
	result.hashCode = result3;
	result.isSample = true;
	return result;
};
mj_Seq.createMedian = function(id,seq) {
	var result = new mj_Seq();
	result.id = id;
	result.redSeq = seq;
	var s = result.redSeq;
	var result1 = 7;
	var _g1 = 0;
	var _g = s.length;
	while(_g1 < _g) {
		var pos = _g1++;
		result1 = 31 * result1 + HxOverrides.cca(s,pos);
	}
	result.hashCode = result1;
	result.isSample = false;
	return result;
};
mj_Seq.prototype = {
	next: null
	,prev: null
	,hashCode: null
	,nextWithHash: null
	,prevWithHash: null
	,calcHashForOrig: function() {
		var s = this.origSeq;
		var result = 7;
		var _g1 = 0;
		var _g = s.length;
		while(_g1 < _g) {
			var pos = _g1++;
			result = 31 * result + HxOverrides.cca(s,pos);
		}
		this.hashCode = result;
	}
	,calcHashForRed: function() {
		var s = this.redSeq;
		var result = 7;
		var _g1 = 0;
		var _g = s.length;
		while(_g1 < _g) {
			var pos = _g1++;
			result = 31 * result + HxOverrides.cca(s,pos);
		}
		this.hashCode = result;
	}
	,names: null
	,indNames: null
	,addName: function(s) {
		if(s != null && s != "") {
			this.names.add(s);
			var result = s;
			if(s != null) {
				var pos = s.lastIndexOf(mj_Seq.delimiter);
				if(pos != -1) {
					result = HxOverrides.substr(s,0,pos);
				}
			}
			var indId = result;
			var result1 = false;
			var _g_head = this.indNames.h;
			while(_g_head != null) {
				var val = _g_head.item;
				_g_head = _g_head.next;
				var indName = val;
				if(indName == indId) {
					result1 = true;
					break;
				}
			}
			if(!result1) {
				this.indNames.add(indId);
			}
		}
	}
	,hasIndIdentifier: function(s) {
		var result = false;
		var _g_head = this.indNames.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var indName = val;
			if(indName == s) {
				result = true;
				break;
			}
		}
		return result;
	}
	,cmpIndIdentifiers: function(o) {
		var result = new List();
		var _g_head = o.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var e = val;
			var result1 = false;
			var _g_head1 = this.indNames.h;
			while(_g_head1 != null) {
				var val1 = _g_head1.item;
				_g_head1 = _g_head1.next;
				var indName = val1;
				if(indName == e) {
					result1 = true;
					break;
				}
			}
			if(result1) {
				result.add(e);
			}
		}
		return result;
	}
	,origSeq: null
	,redSeq: null
	,reduceSequence: function(ipos) {
		var l = new List();
		var _g_head = ipos.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var e = val;
			l.add(this.origSeq.charAt(e));
		}
		this.redSeq = l.join("");
	}
	,constructSeq: function(s,ipos) {
		var i = 0;
		var _g_head = ipos.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var pos = val;
			s[pos] = this.redSeq.charAt(i++);
		}
		var b_b = "";
		var i1 = 0;
		var len = s.length;
		var _g1 = 0;
		var _g = len;
		while(_g1 < _g) {
			var i2 = _g1++;
			b_b += Std.string(Std.string(s[i2]));
			if(i2 < len - 1) {
				b_b += "";
			}
		}
		this.origSeq = b_b;
	}
	,isSample: null
	,id: null
	,spId: null
	,visitedId: null
	,connectedTo: null
	,nrConnections: null
	,linkedTo: null
	,addConnection: function(c) {
		c.next = this.connectedTo;
		this.connectedTo = c;
		this.nrConnections++;
	}
	,clearConnections: function() {
		this.nrConnections = 0;
		this.connectedTo = null;
	}
	,addLinkTo: function(o,names) {
		if(names != null && !names.isEmpty()) {
			var l = new mj_Link();
			l.to = o;
			l.names = names;
			this.linkedTo.add(l);
		}
	}
	,addLinkBySeq: function(os) {
		var o = os.indNames;
		var result = new List();
		var _g_head = o.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var e = val;
			var result1 = false;
			var _g_head1 = this.indNames.h;
			while(_g_head1 != null) {
				var val1 = _g_head1.item;
				_g_head1 = _g_head1.next;
				var indName = val1;
				if(indName == e) {
					result1 = true;
					break;
				}
			}
			if(result1) {
				result.add(e);
			}
		}
		var l = result;
		if(l != null && !l.isEmpty()) {
			var l1 = new mj_Link();
			l1.to = os;
			l1.names = l;
			this.linkedTo.add(l1);
		}
		if(l != null && !l.isEmpty()) {
			var l2 = new mj_Link();
			l2.to = this;
			l2.names = l;
			os.linkedTo.add(l2);
		}
	}
	,__class__: mj_Seq
};
var parsing_LstParser = function() { };
$hxClasses["parsing.LstParser"] = parsing_LstParser;
parsing_LstParser.__name__ = ["parsing","LstParser"];
parsing_LstParser.parseLst = function(fileContent) {
	var result = new List();
	var lines = fileContent.split("\n");
	var lineNo = 0;
	var _g = 0;
	while(_g < lines.length) {
		var line = lines[_g];
		++_g;
		++lineNo;
		var tmp;
		var tmp1;
		if(line != null) {
			var end = line.length;
			while(true) {
				var tmp2;
				if(end > 0) {
					var cCode = HxOverrides.cca(line,end - 1);
					var result1 = false;
					var _g1 = 0;
					var _g11 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
					while(_g1 < _g11.length) {
						var ele = _g11[_g1];
						++_g1;
						if(ele == cCode) {
							result1 = true;
							break;
						}
					}
					tmp2 = result1;
				} else {
					tmp2 = false;
				}
				if(!tmp2) {
					break;
				}
				--end;
			}
			var s = line.substring(0,end);
			var begin = 0;
			var sLen = s.length;
			while(true) {
				var tmp3;
				if(begin < sLen) {
					var cCode1 = HxOverrides.cca(s,begin);
					var result2 = false;
					var _g2 = 0;
					var _g12 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
					while(_g2 < _g12.length) {
						var ele1 = _g12[_g2];
						++_g2;
						if(ele1 == cCode1) {
							result2 = true;
							break;
						}
					}
					tmp3 = result2;
				} else {
					tmp3 = false;
				}
				if(!tmp3) {
					break;
				}
				++begin;
			}
			tmp1 = HxOverrides.substr(s,begin,null) == "";
		} else {
			tmp1 = true;
		}
		if(!tmp1) {
			tmp = line.charAt(0) == "#";
		} else {
			tmp = true;
		}
		if(tmp) {
			continue;
		}
		var pos = line.lastIndexOf("\t");
		if(pos == -1) {
			throw new js__$Boot_HaxeError("Missing tab character in line " + lineNo);
		}
		var name = line.substring(0,pos);
		var end1 = name.length;
		while(true) {
			var name1;
			if(end1 > 0) {
				var cCode2 = HxOverrides.cca(name,end1 - 1);
				var result3 = false;
				var _g3 = 0;
				var _g13 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
				while(_g3 < _g13.length) {
					var ele2 = _g13[_g3];
					++_g3;
					if(ele2 == cCode2) {
						result3 = true;
						break;
					}
				}
				name1 = result3;
			} else {
				name1 = false;
			}
			if(!name1) {
				break;
			}
			--end1;
		}
		var s1 = name.substring(0,end1);
		var begin1 = 0;
		var sLen1 = s1.length;
		while(true) {
			var name2;
			if(begin1 < sLen1) {
				var cCode3 = HxOverrides.cca(s1,begin1);
				var result4 = false;
				var _g4 = 0;
				var _g14 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
				while(_g4 < _g14.length) {
					var ele3 = _g14[_g4];
					++_g4;
					if(ele3 == cCode3) {
						result4 = true;
						break;
					}
				}
				name2 = result4;
			} else {
				name2 = false;
			}
			if(!name2) {
				break;
			}
			++begin1;
		}
		name = HxOverrides.substr(s1,begin1,null);
		var chr = line.substring(pos + 1);
		var end2 = chr.length;
		while(true) {
			var chr1;
			if(end2 > 0) {
				var cCode4 = HxOverrides.cca(chr,end2 - 1);
				var result5 = false;
				var _g5 = 0;
				var _g15 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
				while(_g5 < _g15.length) {
					var ele4 = _g15[_g5];
					++_g5;
					if(ele4 == cCode4) {
						result5 = true;
						break;
					}
				}
				chr1 = result5;
			} else {
				chr1 = false;
			}
			if(!chr1) {
				break;
			}
			--end2;
		}
		var s2 = chr.substring(0,end2);
		var begin2 = 0;
		var sLen2 = s2.length;
		while(true) {
			var chr2;
			if(begin2 < sLen2) {
				var cCode5 = HxOverrides.cca(s2,begin2);
				var result6 = false;
				var _g6 = 0;
				var _g16 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
				while(_g6 < _g16.length) {
					var ele5 = _g16[_g6];
					++_g6;
					if(ele5 == cCode5) {
						result6 = true;
						break;
					}
				}
				chr2 = result6;
			} else {
				chr2 = false;
			}
			if(!chr2) {
				break;
			}
			++begin2;
		}
		chr = HxOverrides.substr(s2,begin2,null);
		if(name == null || name == "" || chr == null || chr == "") {
			throw new js__$Boot_HaxeError("Error in line " + lineNo);
		}
		result.add(new util_Pair(name,chr));
	}
	return result;
};
parsing_LstParser.isValidColor = function(s) {
	if(s == null || s == "") {
		return false;
	}
	s = s.toUpperCase();
	if(s.charAt(0) == "#") {
		if(s.length != 4 && s.length != 7) {
			return false;
		}
		var _g1 = 1;
		var _g = s.length;
		while(_g1 < _g) {
			var i = _g1++;
			var character = s.charAt(i);
			if(character != "0" && character != "1" && character != "2" && character != "3" && character != "4" && character != "5" && character != "6" && character != "7" && character != "8" && character != "9" && character != "A" && character != "B" && character != "C" && character != "D" && character != "E" && character != "F") {
				return false;
			}
		}
		return true;
	} else if(StringTools.startsWith(s,"HSL(") && StringTools.endsWith(s,"%)")) {
		var arr = s.split(",");
		if(arr.length != 3) {
			return false;
		}
		var middle = arr[1];
		if(!StringTools.endsWith(middle,"%")) {
			return false;
		}
		return true;
	} else {
		if(s == "ALICEBLUE") {
			return true;
		}
		if(s == "ANTIQUEWHITE") {
			return true;
		}
		if(s == "AQUA") {
			return true;
		}
		if(s == "AQUAMARINE") {
			return true;
		}
		if(s == "AZURE") {
			return true;
		}
		if(s == "BEIGE") {
			return true;
		}
		if(s == "BISQUE") {
			return true;
		}
		if(s == "BLACK") {
			return true;
		}
		if(s == "BLANCHEDALMOND") {
			return true;
		}
		if(s == "BLUE") {
			return true;
		}
		if(s == "BLUEVIOLET") {
			return true;
		}
		if(s == "BROWN") {
			return true;
		}
		if(s == "BURLYWOOD") {
			return true;
		}
		if(s == "CADETBLUE") {
			return true;
		}
		if(s == "CHARTREUSE") {
			return true;
		}
		if(s == "CHOCOLATE") {
			return true;
		}
		if(s == "CORAL") {
			return true;
		}
		if(s == "CORNFLOWERBLUE") {
			return true;
		}
		if(s == "CORNSILK") {
			return true;
		}
		if(s == "CRIMSON") {
			return true;
		}
		if(s == "CYAN") {
			return true;
		}
		if(s == "DARKBLUE") {
			return true;
		}
		if(s == "DARKCYAN") {
			return true;
		}
		if(s == "DARKGOLDENROD") {
			return true;
		}
		if(s == "DARKGRAY") {
			return true;
		}
		if(s == "DARKGREY") {
			return true;
		}
		if(s == "DARKGREEN") {
			return true;
		}
		if(s == "DARKKHAKI") {
			return true;
		}
		if(s == "DARKMAGENTA") {
			return true;
		}
		if(s == "DARKOLIVEGREEN") {
			return true;
		}
		if(s == "DARKORANGE") {
			return true;
		}
		if(s == "DARKORCHID") {
			return true;
		}
		if(s == "DARKRED") {
			return true;
		}
		if(s == "DARKSALMON") {
			return true;
		}
		if(s == "DARKSEAGREEN") {
			return true;
		}
		if(s == "DARKSLATEBLUE") {
			return true;
		}
		if(s == "DARKSLATEGRAY") {
			return true;
		}
		if(s == "DARKSLATEGREY") {
			return true;
		}
		if(s == "DARKTURQUOISE") {
			return true;
		}
		if(s == "DARKVIOLET") {
			return true;
		}
		if(s == "DEEPPINK") {
			return true;
		}
		if(s == "DEEPSKYBLUE") {
			return true;
		}
		if(s == "DIMGRAY") {
			return true;
		}
		if(s == "DIMGREY") {
			return true;
		}
		if(s == "DODGERBLUE") {
			return true;
		}
		if(s == "FIREBRICK") {
			return true;
		}
		if(s == "FLORALWHITE") {
			return true;
		}
		if(s == "FORESTGREEN") {
			return true;
		}
		if(s == "FUCHSIA") {
			return true;
		}
		if(s == "GAINSBORO") {
			return true;
		}
		if(s == "GHOSTWHITE") {
			return true;
		}
		if(s == "GOLD") {
			return true;
		}
		if(s == "GOLDENROD") {
			return true;
		}
		if(s == "GRAY") {
			return true;
		}
		if(s == "GREY") {
			return true;
		}
		if(s == "GREEN") {
			return true;
		}
		if(s == "GREENYELLOW") {
			return true;
		}
		if(s == "HONEYDEW") {
			return true;
		}
		if(s == "HOTPINK") {
			return true;
		}
		if(s == "INDIANRED") {
			return true;
		}
		if(s == "INDIGO") {
			return true;
		}
		if(s == "IVORY") {
			return true;
		}
		if(s == "KHAKI") {
			return true;
		}
		if(s == "LAVENDER") {
			return true;
		}
		if(s == "LAVENDERBLUSH") {
			return true;
		}
		if(s == "LAWNGREEN") {
			return true;
		}
		if(s == "LEMONCHIFFON") {
			return true;
		}
		if(s == "LIGHTBLUE") {
			return true;
		}
		if(s == "LIGHTCORAL") {
			return true;
		}
		if(s == "LIGHTCYAN") {
			return true;
		}
		if(s == "LIGHTGOLDENRODYELLOW") {
			return true;
		}
		if(s == "LIGHTGRAY") {
			return true;
		}
		if(s == "LIGHTGREY") {
			return true;
		}
		if(s == "LIGHTGREEN") {
			return true;
		}
		if(s == "LIGHTPINK") {
			return true;
		}
		if(s == "LIGHTSALMON") {
			return true;
		}
		if(s == "LIGHTSEAGREEN") {
			return true;
		}
		if(s == "LIGHTSKYBLUE") {
			return true;
		}
		if(s == "LIGHTSLATEGRAY") {
			return true;
		}
		if(s == "LIGHTSLATEGREY") {
			return true;
		}
		if(s == "LIGHTSTEELBLUE") {
			return true;
		}
		if(s == "LIGHTYELLOW") {
			return true;
		}
		if(s == "LIME") {
			return true;
		}
		if(s == "LIMEGREEN") {
			return true;
		}
		if(s == "LINEN") {
			return true;
		}
		if(s == "MAGENTA") {
			return true;
		}
		if(s == "MAROON") {
			return true;
		}
		if(s == "MEDIUMAQUAMARINE") {
			return true;
		}
		if(s == "MEDIUMBLUE") {
			return true;
		}
		if(s == "MEDIUMORCHID") {
			return true;
		}
		if(s == "MEDIUMPURPLE") {
			return true;
		}
		if(s == "MEDIUMSEAGREEN") {
			return true;
		}
		if(s == "MEDIUMSLATEBLUE") {
			return true;
		}
		if(s == "MEDIUMSPRINGGREEN") {
			return true;
		}
		if(s == "MEDIUMTURQUOISE") {
			return true;
		}
		if(s == "MEDIUMVIOLETRED") {
			return true;
		}
		if(s == "MIDNIGHTBLUE") {
			return true;
		}
		if(s == "MINTCREAM") {
			return true;
		}
		if(s == "MISTYROSE") {
			return true;
		}
		if(s == "MOCCASIN") {
			return true;
		}
		if(s == "NAVAJOWHITE") {
			return true;
		}
		if(s == "NAVY") {
			return true;
		}
		if(s == "OLDLACE") {
			return true;
		}
		if(s == "OLIVE") {
			return true;
		}
		if(s == "OLIVEDRAB") {
			return true;
		}
		if(s == "ORANGE") {
			return true;
		}
		if(s == "ORANGERED") {
			return true;
		}
		if(s == "ORCHID") {
			return true;
		}
		if(s == "PALEGOLDENROD") {
			return true;
		}
		if(s == "PALEGREEN") {
			return true;
		}
		if(s == "PALETURQUOISE") {
			return true;
		}
		if(s == "PALEVIOLETRED") {
			return true;
		}
		if(s == "PAPAYAWHIP") {
			return true;
		}
		if(s == "PEACHPUFF") {
			return true;
		}
		if(s == "PERU") {
			return true;
		}
		if(s == "PINK") {
			return true;
		}
		if(s == "PLUM") {
			return true;
		}
		if(s == "POWDERBLUE") {
			return true;
		}
		if(s == "PURPLE") {
			return true;
		}
		if(s == "REBECCAPURPLE") {
			return true;
		}
		if(s == "RED") {
			return true;
		}
		if(s == "ROSYBROWN") {
			return true;
		}
		if(s == "ROYALBLUE") {
			return true;
		}
		if(s == "SADDLEBROWN") {
			return true;
		}
		if(s == "SALMON") {
			return true;
		}
		if(s == "SANDYBROWN") {
			return true;
		}
		if(s == "SEAGREEN") {
			return true;
		}
		if(s == "SEASHELL") {
			return true;
		}
		if(s == "SIENNA") {
			return true;
		}
		if(s == "SILVER") {
			return true;
		}
		if(s == "SKYBLUE") {
			return true;
		}
		if(s == "SLATEBLUE") {
			return true;
		}
		if(s == "SLATEGRAY") {
			return true;
		}
		if(s == "SLATEGREY") {
			return true;
		}
		if(s == "SNOW") {
			return true;
		}
		if(s == "SPRINGGREEN") {
			return true;
		}
		if(s == "STEELBLUE") {
			return true;
		}
		if(s == "TAN") {
			return true;
		}
		if(s == "TEAL") {
			return true;
		}
		if(s == "THISTLE") {
			return true;
		}
		if(s == "TOMATO") {
			return true;
		}
		if(s == "TURQUOISE") {
			return true;
		}
		if(s == "VIOLET") {
			return true;
		}
		if(s == "WHEAT") {
			return true;
		}
		if(s == "WHITE") {
			return true;
		}
		if(s == "WHITESMOKE") {
			return true;
		}
		if(s == "YELLOW") {
			return true;
		}
		if(s == "YELLOWGREEN") {
			return true;
		}
	}
	return false;
};
parsing_LstParser.parseColorList = function(fileContent) {
	var result = parsing_LstParser.parseLst(fileContent);
	var lst = new List();
	var _g_head = result.h;
	while(_g_head != null) {
		var val = _g_head.item;
		_g_head = _g_head.next;
		var pair = val;
		pair.second = StringTools.trim(pair.second);
		if(!parsing_LstParser.isValidColor(pair.second)) {
			lst.add(pair.second);
		}
	}
	if(!lst.isEmpty()) {
		throw new js__$Boot_HaxeError("Invalid color(s) " + lst.join(","));
	}
	return result;
};
var parsing_MJNetParser = function() { };
$hxClasses["parsing.MJNetParser"] = parsing_MJNetParser;
parsing_MJNetParser.__name__ = ["parsing","MJNetParser"];
parsing_MJNetParser.countIndents = function(s) {
	var result = 0;
	while(true) {
		var cCode = HxOverrides.cca(s,result);
		var result1 = false;
		var _g = 0;
		var _g1 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
		while(_g < _g1.length) {
			var ele = _g1[_g];
			++_g;
			if(ele == cCode) {
				result1 = true;
				break;
			}
		}
		if(!result1) {
			break;
		}
		++result;
	}
	return result;
};
parsing_MJNetParser.parseNet = function(fileContent) {
	var lines = fileContent.split("\n");
	var result = new List();
	var lineNo = 0;
	var currentNode = null;
	var readNames = false;
	var readCons = false;
	var readLinks = false;
	var _g = 0;
	while(_g < lines.length) {
		var line = lines[_g];
		++_g;
		++lineNo;
		var end = line.length;
		while(true) {
			var tmp;
			if(end > 0) {
				var cCode = HxOverrides.cca(line,end - 1);
				var result1 = false;
				var _g1 = 0;
				var _g11 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
				while(_g1 < _g11.length) {
					var ele = _g11[_g1];
					++_g1;
					if(ele == cCode) {
						result1 = true;
						break;
					}
				}
				tmp = result1;
			} else {
				tmp = false;
			}
			if(!tmp) {
				break;
			}
			--end;
		}
		var s = line.substring(0,end);
		var begin = 0;
		var sLen = s.length;
		while(true) {
			var tmp1;
			if(begin < sLen) {
				var cCode1 = HxOverrides.cca(s,begin);
				var result2 = false;
				var _g2 = 0;
				var _g12 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
				while(_g2 < _g12.length) {
					var ele1 = _g12[_g2];
					++_g2;
					if(ele1 == cCode1) {
						result2 = true;
						break;
					}
				}
				tmp1 = result2;
			} else {
				tmp1 = false;
			}
			if(!tmp1) {
				break;
			}
			++begin;
		}
		var line_ = HxOverrides.substr(s,begin,null);
		if(line_ == null || line_ == "" || line_.charAt(0) == "#") {
			continue;
		}
		var result3 = 0;
		while(true) {
			var cCode2 = HxOverrides.cca(line,result3);
			var result4 = false;
			var _g3 = 0;
			var _g13 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
			while(_g3 < _g13.length) {
				var ele2 = _g13[_g3];
				++_g3;
				if(ele2 == cCode2) {
					result4 = true;
					break;
				}
			}
			if(!result4) {
				break;
			}
			++result3;
		}
		var indents = result3;
		if(indents == 0 && (line_ == "SAMPLED_SEQUENCE" || line_ == "MEDIAN_VECTOR")) {
			if(currentNode != null) {
				result.add(currentNode);
			}
			currentNode = new parsing_Node();
			currentNode.type = line_ == "SAMPLED_SEQUENCE" ? parsing_SEQ_$TYPE.SAMPLED_SEQUENCE : parsing_SEQ_$TYPE.MEDIAN_VECTOR;
			readNames = false;
			readCons = false;
			readLinks = false;
			continue;
		}
		if(currentNode == null) {
			throw new js__$Boot_HaxeError("Expected SAMPLED_SEQUENCE or MEDIAN_VECTOR in line " + lineNo + "!");
		}
		if(indents == 2 && HxOverrides.substr(line_,0,"ID".length) == "ID") {
			currentNode.id = Std.parseInt(line_.split(" ")[1]);
		} else if(indents == 2 && HxOverrides.substr(line_,0,"FFR_ID".length) == "FFR_ID") {
			currentNode.spId = Std.parseInt(line_.split(" ")[1]);
		} else if(indents == 2 && HxOverrides.substr(line_,0,"SEQUENCE".length) == "SEQUENCE") {
			currentNode.seq = line_.split(" ")[1];
		} else if(!(indents == 2 && HxOverrides.substr(line_,0,"NB_NAMES".length) == "NB_NAMES")) {
			if(indents == 2 && HxOverrides.substr(line_,0,"NAMES".length) == "NAMES") {
				readNames = true;
				readCons = false;
				readLinks = false;
			} else if(indents == 2 && HxOverrides.substr(line_,0,"CONNECTED_TO".length) == "CONNECTED_TO") {
				readNames = false;
				readCons = true;
				readLinks = false;
			} else if(indents == 2 && HxOverrides.substr(line_,0,"LINKED_TO".length) == "LINKED_TO") {
				readNames = false;
				readCons = false;
				readLinks = true;
			} else if(indents == 4 && (readNames || readCons || readLinks)) {
				if(readNames) {
					currentNode.names.add(line_);
				} else if(readCons) {
					var d = line_.split(" ");
					var l = new List();
					var _g21 = 5;
					var _g14 = d.length;
					while(_g21 < _g14) {
						var i = _g21++;
						l.add(Std.parseInt(d[i]));
					}
					currentNode.cons.add(new util_Pair(Std.parseInt(d[1]),l));
				} else if(readLinks) {
					var d1 = line_.split(" ");
					currentNode.links.add(new util_Pair(Std.parseInt(d1[1]),Std.parseInt(d1[3])));
				}
			} else {
				throw new js__$Boot_HaxeError("Unexpected expression in line " + lineNo + "!");
			}
		}
	}
	if(currentNode != null) {
		result.add(currentNode);
	}
	return result;
};
parsing_MJNetParser.main = function() {
};
var parsing_SEQ_$TYPE = $hxClasses["parsing.SEQ_TYPE"] = { __ename__ : ["parsing","SEQ_TYPE"], __constructs__ : ["SAMPLED_SEQUENCE","MEDIAN_VECTOR"] };
parsing_SEQ_$TYPE.SAMPLED_SEQUENCE = ["SAMPLED_SEQUENCE",0];
parsing_SEQ_$TYPE.SAMPLED_SEQUENCE.toString = $estr;
parsing_SEQ_$TYPE.SAMPLED_SEQUENCE.__enum__ = parsing_SEQ_$TYPE;
parsing_SEQ_$TYPE.MEDIAN_VECTOR = ["MEDIAN_VECTOR",1];
parsing_SEQ_$TYPE.MEDIAN_VECTOR.toString = $estr;
parsing_SEQ_$TYPE.MEDIAN_VECTOR.__enum__ = parsing_SEQ_$TYPE;
parsing_SEQ_$TYPE.__empty_constructs__ = [parsing_SEQ_$TYPE.SAMPLED_SEQUENCE,parsing_SEQ_$TYPE.MEDIAN_VECTOR];
var parsing_Node = function() {
	this.names = new List();
	this.cons = new List();
	this.links = new List();
};
$hxClasses["parsing.Node"] = parsing_Node;
parsing_Node.__name__ = ["parsing","Node"];
parsing_Node.prototype = {
	type: null
	,id: null
	,spId: null
	,seq: null
	,names: null
	,cons: null
	,links: null
	,__class__: parsing_Node
};
var parsing_Parse = function() { };
$hxClasses["parsing.Parse"] = parsing_Parse;
parsing_Parse.__name__ = ["parsing","Parse"];
parsing_Parse.startsWith = function(t,s) {
	return HxOverrides.substr(t,0,s.length) == s;
};
parsing_Parse.isWhitespace = function(s,pos) {
	var cCode = HxOverrides.cca(s,pos);
	var result = false;
	var _g = 0;
	var _g1 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
	while(_g < _g1.length) {
		var ele = _g1[_g];
		++_g;
		if(ele == cCode) {
			result = true;
			break;
		}
	}
	return result;
};
parsing_Parse.stripStringBegin = function(s) {
	var begin = 0;
	var sLen = s.length;
	while(true) {
		var tmp;
		if(begin < sLen) {
			var cCode = HxOverrides.cca(s,begin);
			var result = false;
			var _g = 0;
			var _g1 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
			while(_g < _g1.length) {
				var ele = _g1[_g];
				++_g;
				if(ele == cCode) {
					result = true;
					break;
				}
			}
			tmp = result;
		} else {
			tmp = false;
		}
		if(!tmp) {
			break;
		}
		++begin;
	}
	return HxOverrides.substr(s,begin,null);
};
parsing_Parse.stripStringEnd = function(s) {
	var end = s.length;
	while(true) {
		var tmp;
		if(end > 0) {
			var cCode = HxOverrides.cca(s,end - 1);
			var result = false;
			var _g = 0;
			var _g1 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
			while(_g < _g1.length) {
				var ele = _g1[_g];
				++_g;
				if(ele == cCode) {
					result = true;
					break;
				}
			}
			tmp = result;
		} else {
			tmp = false;
		}
		if(!tmp) {
			break;
		}
		--end;
	}
	return s.substring(0,end);
};
parsing_Parse.stripString = function(s) {
	var end = s.length;
	while(true) {
		var tmp;
		if(end > 0) {
			var cCode = HxOverrides.cca(s,end - 1);
			var result = false;
			var _g = 0;
			var _g1 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
			while(_g < _g1.length) {
				var ele = _g1[_g];
				++_g;
				if(ele == cCode) {
					result = true;
					break;
				}
			}
			tmp = result;
		} else {
			tmp = false;
		}
		if(!tmp) {
			break;
		}
		--end;
	}
	var s1 = s.substring(0,end);
	var begin = 0;
	var sLen = s1.length;
	while(true) {
		var tmp1;
		if(begin < sLen) {
			var cCode1 = HxOverrides.cca(s1,begin);
			var result1 = false;
			var _g2 = 0;
			var _g11 = [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279];
			while(_g2 < _g11.length) {
				var ele1 = _g11[_g2];
				++_g2;
				if(ele1 == cCode1) {
					result1 = true;
					break;
				}
			}
			tmp1 = result1;
		} else {
			tmp1 = false;
		}
		if(!tmp1) {
			break;
		}
		++begin;
	}
	return HxOverrides.substr(s1,begin,null);
};
var util_Pair = function(u,v) {
	this.second = null;
	this.first = null;
	this.first = u;
	this.second = v;
};
$hxClasses["util.Pair"] = util_Pair;
util_Pair.__name__ = ["util","Pair"];
util_Pair.prototype = {
	first: null
	,second: null
	,swapFirst: function(p) {
		var tmp = this.first;
		this.first = p.first;
		p.first = tmp;
	}
	,swapSecond: function(p) {
		var tmp = this.second;
		this.second = p.second;
		p.second = tmp;
	}
	,swap: function(p) {
		this.swapFirst(p);
		this.swapSecond(p);
	}
	,__class__: util_Pair
};
var util_StdOutPrinter = function() {
	this.indent = "  ";
	this.newline = "\n";
	this.countingOffset = 1;
};
$hxClasses["util.StdOutPrinter"] = util_StdOutPrinter;
util_StdOutPrinter.__name__ = ["util","StdOutPrinter"];
util_StdOutPrinter.__interfaces__ = [interfaces_Printer];
util_StdOutPrinter.prototype = {
	countingOffset: null
	,newline: null
	,indent: null
	,printString: function(s) {
		haxe_Log.trace(s,{ fileName : "StdOutPrinter.hx", lineNumber : 15, className : "util.StdOutPrinter", methodName : "printString"});
	}
	,close: function() {
	}
	,__class__: util_StdOutPrinter
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
function $arrayPush(x) { this.push(x); }
$hxClasses["Math"] = Math;
String.prototype.__class__ = $hxClasses["String"] = String;
String.__name__ = ["String"];
$hxClasses["Array"] = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses["Date"] = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses["Int"] = { __name__ : ["Int"]};
var Dynamic = $hxClasses["Dynamic"] = { __name__ : ["Dynamic"]};
var Float = $hxClasses["Float"] = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses["Bool"] = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses["Class"] = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses["Void"] = { __ename__ : ["Void"]};
var __map_reserved = {};
StringTools.winMetaCharacters = [32,40,41,37,33,94,34,60,62,38,124,10,13,44,59];
draw_NodePos.areaShouldBePropTo = draw_SIZE_$TO_$RADIUS.SQRT;
js_Boot.__toStr = ({ }).toString;
mj_Seq.delimiter = "_";
