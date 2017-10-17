import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, Entry } from '@ionic-native/file';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  window:any;
  
  imageURI:any;
  imageFileName:any;

  constructor(public navCtrl: NavController,
    private transfer: FileTransfer,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private file:File

  ) {}
  
  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = `data:image/jpeg;base64,${imageData}`;
      
       // var blob= this.dataURItoBlob(imageData);
       this.imageFileName =this.imageURI;
      fetch(this.imageURI)
      .then(res => res.blob())
      .then(blob => {
        var fd = new FormData()
        fd.append('files', blob, 'identityfront')
        fd.append('files', blob, 'filenameback')
        fd.append('access_token','access_token1')
        
        console.log(blob)
        // Upload
        fetch('http://192.168.1.151:8080/upload/identity', {method: 'POST', body: fd})
      })
      
    //   this.imageURI ="file:///Users/guangrongyang/Downloads/file.jpg";
    //  // this.file.writeFile("/Users/guangrongyang/Downloads/","file1.jpg",imageData);

    //   this.file.resolveLocalFilesystemUrl(this.imageURI).then((fileEntry) => {
    //     debugger
    //        this.imageURI = fileEntry; // "img/bg1.jpg" ;
        
    //     });
        if(this.imageURI  ==""){
       
          
        }
        
       
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  uploadFile() {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'file.jpg',
      // chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    }

    fileTransfer.upload(this.imageURI, encodeURI('http://192.168.1.151:8080/upload/'), options)
      .then((data) => {
      console.log(data+" Uploaded Successfully");
      this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
      loader.dismiss();
      this.presentToast("Image uploaded successfully");
    }, (err) => {
      console.log(err);
      loader.dismiss();
      this.presentToast(err);
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 6000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
   dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    // if (dataURI.split(',')[0].indexOf('base64') >= 0)
    //     byteString = atob(dataURI.split(',')[1]);
    // else
    //     byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    // var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var mimeString = "image/jpeg";
    byteString = atob(dataURI);

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}
testUploadBlob(){
  var url = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
 
  
  fetch(url)
  .then(res => res.blob())
  .then(blob => {
    var fd = new FormData()
    fd.append('file', blob, 'filename')
    
    console.log(blob)
    // Upload
    fetch('http://192.168.1.151:8080/upload/', {method: 'POST', body: fd})
  })
}
  
}
