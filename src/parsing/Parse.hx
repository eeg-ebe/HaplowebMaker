package parsing;

/**
 * This class contains static methods that are usefull for parsing.
 */
class Parse {
     public static inline function startsWith(t:String,s:String):Bool {
         return t.substr(0, s.length) == s;
     }
     public static inline function isWhitespace(s:String, pos:Int):Bool {
         var cCode:Int = s.charCodeAt(pos);
         var result:Bool = false;
         for(ele in [9,10,11,12,13,32,133,160,5760,8192,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,6158,8203,8204,8205,8288,65279]) {
             if(ele == cCode) {
                 result = true;
                 break;
             }
         }
         return result;
     }
     public static inline function stripStringBegin(s:String):String {
         var begin:Int = 0;
         var sLen:Int = s.length;
         while(begin < sLen && isWhitespace(s, begin)) {
             begin++;
         }
         return s.substr(begin);
     }
     public static inline function stripStringEnd(s:String):String {
         var end:Int = s.length;
         while(end > 0 && isWhitespace(s, end-1)) {
             end--;
         }
         return s.substring(0, end);
     }
     public static inline function stripString(s:String):String {
         return stripStringBegin(stripStringEnd(s));
     }
}
