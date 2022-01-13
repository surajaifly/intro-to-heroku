import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';

/*
    Prettify objects returned from Salesforce. This is optional, but it allows us to keep the templates independent
    from the Salesforce specific naming convention. This could also be done Salesforce-side by creating a custom REST service.
 */
let prettifyProperty = (property) => {
    let prettyProperty = {
        id: property.sfid,
        title: property.title,
        city: property.firstname,
        state: property.lastname,
        price: property.level__c,
        priceFormatted: "$" + "100",
        beds: Math.floor(Math.random() * 5) + 1 ,
        baths: Math.floor(Math.random() * 2) + 1 ,
        description: 'Test Decription',
        picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpGj-KjriTMRVX-pHHUKcyxQe3wblMTAq3t5iA_xivZwFq9sjbGuYmRICJ60qH0zx9uF0&usqp=CAU',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/1200px-Volkswagen_logo_2019.svg.png',
        likes: Math.floor(Math.random() * 20) + 1 // Likes are simulated: random number between 0 and 20. See "Favorites" for similar functionality.
    };
    prettyProperty.broker = property.broker__c_sfid ?
        {
            id: property.sfid,
            name: property.name,
            title: property.title,
            picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpGj-KjriTMRVX-pHHUKcyxQe3wblMTAq3t5iA_xivZwFq9sjbGuYmRICJ60qH0zx9uF0&usqp=CAU'
        } : {};
    return prettyProperty;
};

let seeRespose = (property) => {
    console.log('property', property);
};

let prettifyFavorite = (favorite) => {
    return {
        id: favorite.favorite__c_sfid,
        property: prettifyProperty(favorite)
    };
};

@Injectable()
export class PropertyService {

    static get parameters() {
        return [Http];
    }

    constructor(http) {
        this.http = http;
    }

    
    /*
    findAll() {
        return this.http.get('/property').map(response => response.json().map(prettifyProperty));
    }
    */
    findAll() {
        return this.http.get('/contact').map(response => response.json().map(prettifyProperty));
    }

    /*
    findById(id) {
        return this.http.get('/property/' + id).map(response => prettifyProperty(response.json()));
    }
    */
    findById(id) {
        //return this.http.post('/contact/' + id).map(response => prettifyProperty(response.json()));
        return this.http.post('/contact/' + id).map(response => seeRespose(response));
    }

    updateContact(contactObj) { 
        return this.http.post('/updatecontact/', contactObj).map(response => seeRespose(response));
    }

    getFavorites() {
        return this.http.get('/favorite').map(response => response.json().map(prettifyFavorite));
    }

    favorite(property) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/favorite', JSON.stringify({ 'property__c': property.id }), {headers: headers});
    }

    unfavorite(favorite) {
        return this.http.delete('/favorite/' + favorite.id);
    }

    like(property) {
    }

}
