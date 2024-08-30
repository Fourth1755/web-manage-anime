export class ConnectAnimapService {
    private url:string
    private authorization:string

    constructor() {
        this.url = "http://localhost:8080"
        this.authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvdXJ0aEBnbWFpbC5jb20iLCJleHAiOjE3MjQ4MzI0MjAsInJvbGUiOiJhZG1pbiJ9.puBrLutqxUtoSjLhC7c3nDTKRgahyueMTPOl_gwDPkk'
      }

    private getUrl(){
        return this.url
    }

    public getAuthorization(){
        return this.authorization
    }

    public getArtistUrl(){
        const url = new URL("/artists", this.url);
        return url.toString()
    }

    public getSongsUrl(){
        const url = new URL("/songs", this.url);
        return url.toString()
    }

    public getAnimesUrl(){
        const url = new URL("/animes", this.url);
        return url.toString()
    }

    public getCategoriesUrl(){
        const url = new URL("/category", this.url);
        return url.toString()
    }
}