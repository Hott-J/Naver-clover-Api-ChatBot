const scriptName = "네이버 Clover API를 이용한 얼굴인식";
/**
* (string) room
* (string) sender
* (boolean) isGroupChat
* (void) replier.reply(message)
* (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
* (string) imageDB.getProfileBase64()
* (string) packageName
*/

const lastPath = null;
const PICTURE_PATH = "sdcard/Android/data/com.kakao.talk/contents/Mg==";
const client_id = '아이디';
const client_secret = '시크릿';

function requestCFR() {
  try{
    var api_url = 'https://openapi.naver.com/v1/vision/face';
    var file = new java.io.File("/sdcard/base.jpg");
    var res = JSON.parse(org.jsoup.Jsoup.connect(api_url)
    .header('X-Naver-Client-Id',"myId" )
    .header('X-Naver-Client-Secret',"password" )
    .data('image', file.getName(), new java.io.FileInputStream(file))
    .ignoreContentType(true)
    .post().text());
    return res;
  }catch(e){
    return e.name + "\n" + e.message + "\n" + e.lineNumber;
  }
}

function requestTalent() {
  try{
    var api_url = "https://openapi.naver.com/v1/vision/celebrity";
    var file = new java.io.File("/sdcard/base.jpg");
    var res = JSON.parse(org.jsoup.Jsoup.connect(api_url)
    .header('X-Naver-Client-Id',"Y20mDx78IRBY1Ca_8951" )
    .header('X-Naver-Client-Secret',"9tqL86m9vV" )
    .data('image', file.getName(), new java.io.FileInputStream(file))
    .ignoreContentType(true)
    .post().text());
    return res;
  }catch(e){
    return e.name + "\n" + e.message + "\n" + e.lineNumber;
  }
}

function getLastPictureFolderPath(){
  var file = new java.io.File(PICTURE_PATH);
  var list = file.listFiles().sort(function(a, b){
    return b.lastModified() -a.lastModified();
  });
  return list[0].toString();
}

function getLastPictureFilePathFromFoldPath(path){
  var file = new java.io.File(path);
  var list = file.listFiles().sort(function(a, b){
    return b.lastModified() - a.lastModified();
  }); return list;
}

function getLastPicture(r){
  try{
    var path = getLastPictureFilePathFromFoldPath(getLastPictureFolderPath());
    for(var i=0;i<path.length;i++){
      var file = new java.io.File(path[i].toString()); if(file.listFiles().length == 0) continue;
      else {
        var picture = getLastPictureFilePathFromFoldPath(file.getPath())[0].toString();

        let baos = new java.io.ByteArrayOutputStream();
        let bm = android.graphics.BitmapFactory.decodeFile(picture)
        try{
          bm.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, baos);
        }catch(e){}
        let bImage = baos.toByteArray();
        let base64 = android.util.Base64.encodeToString(bImage, android.util.Base64.NO_WRAP);
        //Log.d(picture
        Log.d(base64);
        return base64;
      }
    }
    return null;
  } catch(e){
    return null;
  }
}

function decode(base64){
  return android.util.Base64.decode(base64, android.util.Base64.DEFAULT);
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(msg=='!얼굴인식') {
    fos=new java.io.FileOutputStream(new java.io.File("/sdcard/base.jpg"));
    fos.write(decode(getLastPicture(room)));
    try{
      r=requestCFR();
      t=requestTalent();
      g_v=r.faces[0].gender.value;
      g_c=r.faces[0].gender.confidence*100;
      a_v=r.faces[0].age.value;
      a_c=r.faces[0].age.confidence*100;
      e_v=r.faces[0].emotion.value;
      e_c=r.faces[0].emotion.confidence*100;
      t_v=t.faces[0].celebrity.value;
      t_c=t.faces[0].celebrity.confidence*100;
      replier.reply("닮은사람: "+t_v+"\n정확도: "+(t_c).toFixed(2)+"%"+"\n성별: "+g_v+"\n정확도: "+g_c.toFixed(2)+"%"+"\n나이: "+a_v+"\n정확도: "
      +a_c.toFixed(2)+"%"+"\n표정/감정: "+e_v+"\n정확도: "+e_c.toFixed(2)+"%");
    }
    catch(e){replier.reply("제대로 된 정면 사진을 올려주세요\n사람다운 사진만 인식가능합니다");}
  }
}
