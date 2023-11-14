import { Component, AfterViewInit, NgZone } from '@angular/core';

@Component({
  selector: 'd280_app',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss']
})
export class WorldComponent implements AfterViewInit{

  defaultInfoMessage: string = 'Click on a Country to Retrieve Data';
  isCountrySelected: boolean = false;
  isCountryClicked: boolean = false;
  countryData: any = null;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    const svgEmbed = document.querySelector('embed') as HTMLEmbedElement;
    svgEmbed.addEventListener('load', () => {
      const svgDoc = (svgEmbed as any).getSVGDocument();
      const svgCountryPaths = svgDoc.querySelectorAll('path');
      let lastClickedCountry: any = null;

      Array.prototype.forEach.call(svgCountryPaths, (svgCountry: any) => {

        svgCountry.addEventListener('mouseover', (event:MouseEvent)=> {
          const path = event.target as SVGPathElement;
          path.style.fill = 'red';
          this.isCountrySelected = true;
          if (!this.isCountryClicked) {
            this.isCountrySelected = false;
            }  
        });
  
        svgCountry.addEventListener('mouseleave', (event:MouseEvent)=> {
          const path = event.target as SVGPathElement;
           if (path !== lastClickedCountry) { 
          path.style.fill = '';
        } 
          this.ngZone.run(() => {
            if (!this.isCountryClicked) {
              this.isCountrySelected = false;
              this.countryData = null;
              if (lastClickedCountry) {
                lastClickedCountry.style.fill = '';
                lastClickedCountry = null;
              }
            }
          });
        });
        
        svgCountry.addEventListener('mouseenter', () => {
          this.isCountryClicked = false;
          this.isCountrySelected = true;
          this.ngZone.run(() => this.loadCountryData(svgCountry.id));
        });
  
        svgCountry.addEventListener('click', (event:MouseEvent) => {
          if (lastClickedCountry) {
            lastClickedCountry.style.fill = ''; 
          }
          lastClickedCountry = event.target;
          this.isCountryClicked = true;
          const countryCode = svgCountry.id;
          this.ngZone.run(() => this.loadCountryData(countryCode));
        });
      });
    });
  }

  async loadCountryData(countryCode: string){
    this.isCountrySelected = true;
    let api: string = 'https://api.worldbank.org/V2/country/'+countryCode+'?format=json';
    let res: Response = await fetch(api);
    let data: any =  await res.json();
    let dataPath: any = data[1];

    this.countryData = dataPath[0];

    let name: string = dataPath[0].name;
    document.getElementById('name')!.innerText = name;

    let capital: string = dataPath[0].capitalCity;
    document.getElementById('capital')!.innerText = capital;

    let region: string = dataPath[0].region.value;
    document.getElementById('region')!.innerText = region;

    let income: string = dataPath[0].incomeLevel.value;
    document.getElementById('income')!.innerText = income;

    let longitude: string = dataPath[0].longitude;
    document.getElementById('longitude')!.innerText = longitude;

    let latitude: string = dataPath[0].latitude;
    document.getElementById('latitude')!.innerText = latitude;

  }
  
}

