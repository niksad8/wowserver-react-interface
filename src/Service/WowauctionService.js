
class WowauctionService {
    constructor(){
        this.baseUrl = "https://web-auctioneer.com/";
    }
    async getServerList(id=""){
        let url = this.baseUrl+"api/get-servers?id="+id;
        let res = await fetch(url);
        return res.json();
    }
    async getRealmList(server_id,id=""){
        let url = this.baseUrl+"api/get-realms?server_id="+server_id+"&id="+id;
        let res = await fetch(url);
        return res.json();
    }
    async getProfessionList(id=""){
        let url = this.baseUrl+"api/profession-list?id="+id;
        let res = await fetch(url);
        return res.json();
    }
    async getFullServerList(){
        let url = this.baseUrl+"api/get-full-serverlist";
        let res = await fetch(url);
        return res.json();
    }
    async getProfessionData(realm_id, faction_id, profession_id,search = ""){
        let url = this.baseUrl+"api/profession-items?id="+profession_id+"&faction_id="+faction_id+"&realm_id="+realm_id+"&search="+search;
        let res = await fetch(url);
        return res.json();
    }
    async getItemDetails(item_id,realm_id,faction_id){
        let url = this.baseUrl+"api/get-item-details?id="+item_id+"&faction_id="+faction_id+"&realm_id="+realm_id;
        let res = await fetch(url);
        return res.json();
    }
    async searchForItem(term,realm_id,faction_id){
        let url = this.baseUrl+"api/search?term="+term+"&faction_id="+faction_id+"&realm_id="+realm_id;
        let res = await fetch(url);
        return res.json();
    }
}
export default WowauctionService;