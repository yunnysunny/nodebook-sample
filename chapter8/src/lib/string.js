/**
 * User: sunny
 * Date: 13-9-27
 * Time: 下午2:53
 */
String.prototype.endWith=function(str){
    if(str==null||str==""||this.length==0||str.length>this.length)
        return false;
    if(this.substring(this.length-str.length)==str)
        return true;
    else
        return false;
    return true;
}
/**
 * 当前的字符串是不是以str开头的
 * @param str
 * @return {boolean}
 */
String.prototype.startWith=function(str){
    if(str==null||str==""||this.length==0||str.length>this.length)
        return false;
    if(this.substr(0,str.length)==str)
        return true;
    else
        return false;
    return true;
}