import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { NFC, Ndef } from '@ionic-native/nfc';
import { FirebaseListObservable, AngularFireDatabase  } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {	

  tasks: FirebaseListObservable<any>;

  todo = {
  	DNI: "",
  	Cantidad: "",
  }

  text = ""

  text2 = "No hay NFC";
  	logForm(){
    	this.text = "Current DNI: " + this.todo.DNI;
      this.text2 = "Current Cant: " + this.todo.Cantidad;
    }	  

  constructor(
	  private alertCtrl: AlertController,
	  public navCtrl: NavController,
    public fireDatabase: AngularFireDatabase,
	  nfc: NFC,
	  ndef: Ndef,)
	{  	
      this.tasks = this.fireDatabase.list('/NFC');

      nfc.addNdefListener(() => {

      }, (err) => {
        this.text2 = "error"
      }).subscribe((data) => {
        var message = [
            ndef.textRecord(this.todo.DNI),
            ndef.uriRecord("http://gmedinatorres.es")
        ];
      nfc.write(message);
        this.tasks.push({
              DNI: this.todo.DNI,
              Cantidad: this.todo.Cantidad
         });
      });
 	}


  updateTask( task ){
    this.tasks.update( task.$key,{
      title: task.title,
      done: !task.done
    });
  }

  removeTask( task ){
    this.tasks.remove( task.$key );
  }
  	

}
