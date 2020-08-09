const async = require('async');
const sanityClient = require('@sanity/client')
const client = sanityClient({
  projectId: '69l8b8xl',
  dataset: 'staging',
  token: process.env.TOKEN, // or leave blank to be anonymous user
  useCdn: false // `false` if you want to ensure fresh data
})
/*
var productsToRemove = ["t1S1rZqofDfpPzY7X8Xza0",
"t1S1rZqofDfpPzY7X8Xzp5",
"t1S1rZqofDfpPzY7X8Y0AC",
"t1S1rZqofDfpPzY7X8Y0PH",
"t1S1rZqofDfpPzY7X8Y12U",
"t1S1rZqofDfpPzY7X8Y1lj",
"t1S1rZqofDfpPzY7X8Y3WJ",
"t1S1rZqofDfpPzY7X8Y4La",
"t1S1rZqofDfpPzY7X8Y69B",
"t1S1rZqofDfpPzY7X8Y7Pb",
"t1S1rZqofDfpPzY7X8Y918",
"t1S1rZqofDfpPzY7X8YA5U",
"t1S1rZqofDfpPzY7X8YBCr",
"t1S1rZqofDfpPzY7X8YC28",
"t1S1rZqofDfpPzY7X8YCiM",
"t1S1rZqofDfpPzY7X8YDmi",
"t1S1rZqofDfpPzY7X8YIJD",
"zgxlqk5RNfVxK6rIDLXyfD",
"zgxlqk5RNfVxK6rIDLXz5f",
"zgxlqk5RNfVxK6rIDLXzFa",
"zgxlqk5RNfVxK6rIDLXzW7",
"zgxlqk5RNfVxK6rIDLXzjL",
"zgxlqk5RNfVxK6rIDLXztG",
"zgxlqk5RNfVxK6rIDLY06U",
"zgxlqk5RNfVxK6rIDLY10h",
"zgxlqk5RNfVxK6rIDLY1b4",
"zgxlqk5RNfVxK6rIDLY1rb",
"zgxlqk5RNfVxK6rIDLY2I3",
"zgxlqk5RNfVxK6rIDLY2iV",
"zgxlqk5RNfVxK6rIDLY38x",
"zgxlqk5RNfVxK6rIDLY3wY",
"zgxlqk5RNfVxK6rIDLY4u4",
"zgxlqk5RNfVxK6rIDLY5KW",
"zgxlqk5RNfVxK6rIDLY6Ej",
"zgxlqk5RNfVxK6rIDLY9HC",
"zgxlqk5RNfVxK6rIDLY9he",
"zgxlqk5RNfVxK6rIDLYALK",
"zgxlqk5RNfVxK6rIDLYAlm",
"zgxlqk5RNfVxK6rIDLYBPS",
"zgxlqk5RNfVxK6rIDLYBpu",
"zgxlqk5RNfVxK6rIDLYCJf",
"zgxlqk5RNfVxK6rIDLYCgo",
"zgxlqk5RNfVxK6rIDLYD3x",
"zgxlqk5RNfVxK6rIDLYDXi",
"zgxlqk5RNfVxK6rIDLYEOc",]

async.forEachOfLimit(productsToRemove, 1, (element, key, cb)=>{
    client.delete(element)
  .then(res => {
    console.log('Product deleted', element)
    cb()
  })
  .catch(err => {
    console.error('Delete failed: ', err.message)
    cb()
  })
})

*/
const productsToAdd = require('./sanity-data-2.json');
async.forEachOfLimit(productsToAdd, 1, (element, key, callback)=>{
    console.time(key +'-'+ element.slug.en.current);
    client.create(element).then( res => {
        console.timeEnd(key +'-'+ element.slug.en.current);
        callback()
    }).catch(err => console.log)
}, ()=>{
    console.log('Done', productsToAdd.length)
});

/*
const productsToAdd = require('./sanity-data-2.json');
async.forEachOfLimit(productsToAdd, 1, (element, key, callback)=>{
    console.time(key +'-'+ element.slug.en.current);
    client.patch(element._id).set(element).commit().then( res => {
        console.timeEnd(key +'-'+ element.slug.en.current);
        callback()
    }).catch(err => console.log)
}, ()=>{
    console.log('Done', productsToAdd.length)
});

*/
/*


const uploadProduct = ()=>{
    var el = productsToAdd.pop()
    console.log(el)
    client.create(el).then( res => {
        uploadProduct()
    }).catch(err => console.log)
}

uploadProduct() 

var list = [
    "90 gsm / 60 lb text",
    "115 gsm / 80 lb text",
    "150 gsm / 100 lb text",
    "250 gsm / 100 lb cover",
    "300 gsm / 110 lb cover",
    "350 gsm / 130 lb cover",
]
var list = [
    "4x9-inch",
     "5R",
     "A5",
     "A6",
     "DL",
     "SM",
     "SX",
     "A5L",
     "B5",
     "BB",
     "BC",
     "BD",
     "BX",
     "LG",
     "A4",
     "SQ210x210",
     "210x300-mm",
     "300x400-mm",
     "140x180-mm",
     "210x279-mm",
     "93x216-mm",
     "400x500-mm",
     "500x500-mm",
     "SQ",
     "533x711-mm",
     "610x910-mm",
     ]
     
     var list  = ["200x200-mm", "200x300-mm", "300x300-mm", "300x400-mm", "400x400-mm", "400x500-mm", "400x600-mm", "400x800-mm", "500x500-mm", "500x700-mm", "500x750-mm", "600x600-mm", "600x750-mm", "600x800-mm", "600x900-mm", "700x1050-mm", "300x1000-mm", "300x450-mm", "300x600-mm", "300x900-mm", "500x1000-mm", "750x1000-mm", "750x750-mm"]
     
     
     for( let a in list){
         client.create({
             _type:'standardOption',
             category:{
                 _ref:"7b17ffac-e438-4c32-b500-d63a1b3c8da1",
                 _type:"reference"
                },
                name: {
                    _type: 'translatedString',
                    en: list[a]
                },
                value: list[a]
            }).then(res=>console.log)
            .catch(res=>console.log)
        } 
        
        var list = [
            "Canvases",
            "Business cards",
            "Cards",
            "Flyers and letterheads",
            "Roll ups",
            "Frames",
            "Hangers",
            "Folders",
            "Blank envelopes",
            "Calendars",
            "Single fold brochures",
            "Roll fold brochures",
            "Accordion fold brochures",
            "Multi page brochures",
        ]
        
        for( let a in list){
            client.create({
                _type:'category',
                title: {
                    _type: 'translatedString',
                    en: list[a]
                },
                uid: list[a].replace(/\s|\W/gi, '-')
            }).then(res=>console.log)
            .catch(res=>console.log)
        } 
        
      

var list =["100-lb-cover-coated-silk",
"100-lb-cover-uncoated",
"100-lb-text-coated-silk",
"100-lb-text-uncoated",
"130-lb-cover-coated-silk",
"130-lb-cover-uncoated",
"170-gsm-coated-silk",
"170-gsm-uncoated",
"250-gsm-coated-silk",
"250-gsm-uncoated",
"300-gsm-uncoated",
"350-gsm-coated-silk",
]


for( let a in list){
    client.create({
        _type:'standardOption',
        category:{
            _ref:"895ce774-3831-468f-a9fd-e1369bd1b35f",
            _type:"reference"
           },
        name: {
            _type: 'translatedString',
            en: list[a].replace(/\-/gi, ' ')
        },
        value: list[a]
    }).then(res=>console.log)
    .catch(res=>console.log)
} 
  /* */

/*
var data = {
    "_type": "attribute",
    "category": {
      "_ref": "6c6fdb2b-5bd0-435e-8602-12c6377088b1",
      "_type": "reference"
    },
    "description": "paper-type",
    "icon": {
      "_type": "image",
      "asset": {
        "_ref": "image-2a2b695c16d52b0396a938d95b867cf54679c3cb-32x32-svg",
        "_type": "reference"
      }
    },
    "value": {
      "_type": "translatedString",
      "en": "170 gsm coated silk"
    }
  }

  const papertypes = [
  "100 gsm coated silk",
  "100 gsm uncoated",
  "100 lb cover coated silk",
  "100 lb cover uncoated",
  "100 lb text coated silk",
  "100 lb text uncoated",
  "110 lb cover coated silk",
  "110 lb cover uncoated",
  "115 gsm coated silk",
  "115 gsm uncoated",
  "130 gsm coated silk",
  "130 gsm uncoated",
  "130 lb cover coated silk",
  "130 lb cover uncoated",
  "150 gsm coated silk",
  "150 gsm uncoated",
  "170 gsm coated silk",
  "170 gsm uncoated",
  "200 gsm coated silk",
  "200 gsm uncoated",
  "220 gsm uncoated",
  "250 gsm coated silk",
  "250 gsm uncoated",
  "300 gsm canvas matt",
  "300 gsm canvas premium",
  "300 gsm coated silk",
  "300 gsm uncoated",
  "350 gsm canvas matt",
  "350 gsm canvas premium",
  "350 gsm coated silk",
  "350 gsm uncoated",
  "60 lb text coated silk",
  "60 lb text uncoated",
  "65 lb cover coated silk",
  "65 lb cover uncoated",
  "65 lb text coated silk",
  "65 lb text uncoated",
  "80 lb cover coated silk",
  "80 lb cover uncoated",
  "80 lb text coated silk",
  "80 lb text uncoated",
  "90 gsm coated silk",
  "90 gsm uncoated",
  "90 lb text coated silk",
  "90 lb text uncoated",
]
const createAttr = (attr, cb)=>{
    if(attr){
        console.log('Creating', attr)
        data.value.en = attr;
        client.create(data).then(res=>{cb()})
        .catch(res=>console.log)
    }
}

const run = ()=>{
    createAttr(papertypes.pop(), run)
}

run() */