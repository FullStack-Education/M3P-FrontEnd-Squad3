import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading: boolean = false;

  constructor() { }

  setLoading(loading: boolean) {
    this.loading = loading;
    console.log("chamou", loading); // Para verificar se está chamando corretamente

  }

  getLoading(): boolean {
    return this.loading;
  }

  showLoading(time = 1500){
    this.setLoading(true)
    setTimeout(() => {
			this.setLoading(false);
		},time)
  }
}