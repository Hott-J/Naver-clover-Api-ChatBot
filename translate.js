const scriptName = "네이버 파파고 API를 이용한 번역기";
/**
* (string) room
* (string) sender
* (boolean) isGroupChat
* (void) replier.reply(message)
* (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
* (string) imageDB.getProfileBase64()
* (string) packageName
*/

Utils.papagoTranslate=function(lang1,lang2, value){
  try{var data=org.jsoup.Jsoup.connect("https://openapi.naver.com/v1/papago/n2mt")
  .header("X-Naver-Client-Id","Y20mDx78IRBY1Ca_8951")
  .header("X-Naver-Client-Secret","9tqL86m9vV")
  .data("source",lang1)
  .data("target", lang2)
  .data("text", value)
  .ignoreContentType(true).post().text();
  data=JSON.parse(data);
  return data["message"]["result"]["translatedText"];
}catch(e){
  return null;
}
};

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  var cmd=msg.split(" ")[0];
  var data=msg.replace(cmd+" ","");
  if(cmd=="!번역"){
    var data2=data.split(" ");
    var lang1=data2[0];
    var lang2=data2[1];
    var value=data.replace(lang1+" "+lang2+" ","");
    var result=Utils.papagoTranslate(lang1,lang2,value);
    if(result==null)replier.reply("번역 실패");
    else replier.reply(result);
  }
}
