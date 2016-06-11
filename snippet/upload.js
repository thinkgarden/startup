(function(exports){
  var uploadfile = function(callback,src,dest){
    var file = $(this)[0].files[0];
      var size = file.size;
      if(size > 2097152){
        alert("上传文件最大不能超过2MB");
        return;
      }
      var filePath = $(this).val();
      var fileName = filePath.substring(filePath.lastIndexOf("\\")+1);
      var ext = getFileExt(fileName);
      if($.inArray(ext,imageSuffixes) != -1) {
        var tempName = Math.guid()+ext;
        $.get("/admin/uptoken.php",function(token){
            $("#tips").show();
            upload2qiniu(token,tempName,file,callback,src,dest);
        });
      } else{
        alert("文件格式不合法");
      }

  }
  var getFileExt = function(file) {
    var ext = /\.[^\.]+$/.exec(file)[0].toLowerCase();
    return ext;
  };

  var getExt = function(file) {
      var tempArr = file.split(".");
      var ext;
      if (tempArr.length === 1 || (tempArr[0] === "" && tempArr.length === 2)) {
          ext = "";
      } else {
          ext = tempArr.pop().toLowerCase(); //get the extension and make it lower-case
      }
      return ext;
  };

  var imageSuffixes = [".png", ".jpg", ".jpeg", ".gif", ".bmp"];

  var upload2qiniu = function(token,key,file,callback,src,dest){
    var bucketDomain = "http://7xl2fw.com1.z0.glb.clouddn.com/";
    var formData = new FormData();
    if (key !== null && key !== undefined){
       formData.append('key', key);
    }
    formData.append('token', token);
    formData.append('file', file);
    $.ajax({
      url:"http://up.qiniu.com",
      type:"POST",
      data:formData,
      processData : false,
      contentType : false,
      success:function(ret){
          $("#tips").hide();
          callback(bucketDomain, ret, src, dest);
      },
      error:function(ret){
        console.log(ret);
      }
    });
  };

  var addAttachItem = function(bucketDomain,ret, src, dest){
    var $attachItem = $('<img class="img-rounded" src="">').attr("src",bucketDomain+ret.key);
        var filename = src.val();
        if($.trim(filename).length=="0"){
          src.val(ret.key);
        } else{
         src.val(filename+","+ret.key);
        }
        dest.append($attachItem);

  }

  Math.guid = function(){
    return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    })).toLowerCase();
  }

  exports.uploadfile=uploadfile;
  exports.addAttachItem=addAttachItem;

})(window)
