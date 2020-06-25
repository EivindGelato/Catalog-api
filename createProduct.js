
const sanityClient = require('@sanity/client')
const client = sanityClient({
    projectId: '69l8b8xl',
    dataset: 'staging',
    token: process.env.TOKEN, // or leave blank to be anonymous user
    useCdn: false // `false` if you want to ensure fresh data
})
let previewImage = 'https%3A//images.unsplash.com/photo-1523224949444-170258978eef%3Fixlib%3Drb-1.2.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1082%26q%3D80';
const fs = require('fs');
const request = require('request');
const async = require('async');
const path = require('path');
const https = require('https');
const nanoid = require('nanoid').nanoid;
const _ = require('lodash');


const optionMap = require('./config/optionMap');
const categories = require('./config/categories');
const controls = require('./config/controls');

const variations = require('./Product-rows.json');
let products = _.groupBy(variations, 'Product');
let data = [];

const frameHangerToPoster = {
    "frame_product_frs_279x432-mm_frc": "flat_product_pf_xl_pt_170-gsm-coated-silk_cl_4-0_ct_none_prt_none_sft_none_set_none_hor",
    "frame_product_frs_300x400-mm_frc": "flat_product_pf_300x400-mm_pt_65-lb-cover-coated-silk_cl_4-0_ct_none_prt_none_sft_none_set_none_hor",
    "frame_product_frs_457x610-mm_frc": "flat_product_pf_18x24-inch_pt_200-gsm-uncoated_cl_4-0_ct_none_prt_none_sft_none_set_none_hor",
    "frame_product_frs_500x700-mm_frc": "flat_product_pf_500x700-mm_pt_200-gsm-coated-silk_cl_4-0_ct_none_prt_none_sft_none_set_none_ver",
    "frame_product_frs_610x914-mm_frc": "large-posters_pf_24x36-inch_pt_170-gsm-coated-silk_cl_4-0_ver",
    "frame_product_frs_700x1000-mm_frc": "large-posters_pf_700x1000-mm_pt_170-gsm-coated-silk_cl_4-0_hor",
    "wall_hanger_product_whs_290-mm_whc": "flat_product_pf_xl_pt_170-gsm-coated-silk_cl_4-0_ct_none_prt_none_sft_none_set_none_ver",
    "wall_hanger_product_whs_310-mm_whc": "flat_product_pf_300x400-mm_pt_80-lb-cover-uncoated_cl_4-0_ct_none_prt_none_sft_none_set_none_ver",
    "wall_hanger_product_whs_410-mm_whc": "flat_product_pf_300x400-mm_pt_65-lb-cover-coated-silk_cl_4-0_ct_none_prt_none_sft_none_set_none_hor",
    "wall_hanger_product_whs_450-mm_whc": "flat_product_pf_xl_pt_170-gsm-coated-silk_cl_4-0_ct_none_prt_none_sft_none_set_none_hor",
    "wall_hanger_product_whs_480-mm_whc": "flat_product_pf_18x24-inch_pt_200-gsm-uncoated_cl_4-0_ct_none_prt_none_sft_none_set_none_ver",
    "wall_hanger_product_whs_510-mm_whc": "flat_product_pf_400x500-mm_pt_200-gsm-coated-silk_cl_4-0_ct_none_prt_none_sft_none_set_none_hor",
    "wall_hanger_product_whs_635-mm_whc": "flat_product_pf_18x24-inch_pt_80-lb-cover-uncoated_cl_4-0_ct_none_prt_none_sft_none_set_none_hor",
    "wall_hanger_product_whs_710-mm_whc": "flat_product_pf_500x700-mm_pt_65-lb-cover-coated-silk_cl_4-0_ct_none_prt_none_sft_none_set_none_hor",
}

const findPoster = (str) =>{
    for(let a in frameHangerToPoster){
        if(str.match(a)){
            return frameHangerToPoster[a]
        }
    }
    console.log("No poster found", str)
    return str;
}

const weightMap = {
    "60-lb-text": "90-gsm",
    "80-lb-text": "115-gsm",
    "100-lb-text": "150-gsm",
    "65-lb-cover": "170-gsm",
    "80-lb-cover": "200-gsm",
    "100-lb-cover": "250-gsm",
    "110-lb-cover": "300-gsm",
    "130-lb-cover": "350-gsm",
}
const getType = (id)=>{
    if(!id){return ""}
    return id.match('uncoated') ? 'uncoated' : 'coated-silk'
}
const getWeight = (id)=>{
    if(!id){return ""}
    let i = id.replace(/\-uncoated|\-coated\-silk/gi,'');
    return weightMap[i] || i;
}



const addProduct = (name, category, ID)=>{
    return {
        _id: ID,
        _type: 'product',
        "category": {
            "_ref": categories[category.toLowerCase().replace(/\s|\W/gi, '-')],
            "_type": "reference"
        },
        "productCategory":{
            "_type":"translatedString",
            "en": category,
        },
        "productControls": [],
        "productVariants": [],
        "slug": {
            "_type": "translatedSlug",
            "en": {
                "_type": "slug",
                "current": name.toLowerCase().replace(/\s|\W/gi, '-')
            }
        },
        "title": {
            "_type": "translatedString",
            "en": name
        }
    }
}  

const variationOutput = (el, image, url)=>{
    let formatSize = el.PaperFormat ? optionMap[el.PaperFormat] : (el.CanvasFormat ? optionMap[el.CanvasFormat] : (el.WallHangerSize ? optionMap[el.WallHangerSize+'-hanger'] : el.FrameSize ? optionMap[el.FrameSize+'-frame'] : ""))
    let variationData = {
        "_key": nanoid(),
        "_type": "productOption",
        "productUid": el["Product UID"]
    }
    if(image){
        variationData.preview = image
    }
    if(url){
        variationData.previewurl = url
    }
    if(formatSize){
        variationData.formatsize= {
            "_ref": formatSize,
            "_type": "reference"
        }
    }
    if(el.Orientation) {
        variationData.orientation= {
            "_ref": optionMap[el.Orientation],
            "_type": "reference"
        }
    }
    if(el.CoatingType) {
        variationData.coatingtype= {
            "_ref": optionMap[el.CoatingType],
            "_type": "reference"
        }
    }
/*     if(el.ProtectionType) {
        variationData.coatingsides= {
            "_ref": optionMap['prot-'+el.ProtectionType],
            "_type": "reference"
        }
    }
 */    if(el.CoverPaperType) {
        variationData.coverpapertype= {
            "_ref": optionMap[el.CoverPaperType],
            "_type": "reference"
        }
    }
    if(el.ColorType) {
        variationData.colortype= {
            "_ref": optionMap[el.ColorType],
            "_type": "reference"
        }
    }
    if(el.PaperType) {
        variationData.papertype= {
            "_ref": optionMap[getType(el.PaperType)],
            "_type": "reference"
        }
    }
    if(el.PaperType) {
        variationData.paperweight= {
            "_ref": optionMap[getWeight(el.PaperType)],
            "_type": "reference"
        }
    }
    return variationData;
}

const addVariation = (el, done)=>{
    let autoPreviewCategory = (el.Category === "Posters" || el.Category === "Hangers" || el.Category === "Frames"  );
    if(autoPreviewCategory || el.Image){
        let url = ''
        let productUID = el.Category === "Posters" ? el["Product UID"] : findPoster(el["Product UID"]);
        if(autoPreviewCategory){
            url = 'https://preflight.live.gelato.tech/product/preview?product_uid='+ productUID +'&image_url='+ previewImage +'&type=scene&scene=scene003&width=2000&height=2000'
            switch(el.Category){
                case "Hangers":
                    url += '&hanger='+( el.WallHangerColor.match('wood') ? 'wood': el.WallHangerColor )
                    break;
                case "Frames":
                    url += '&frame='+( el.FrameColor.match('wood') ? 'wood': el.FrameColor )
                    break;
                default: 
                break;
            }
            return done(variationOutput(el, false, url))
        }else{
            url = el.Image
            console.log('Getting image => ', url)
            const filepath = path.join(__dirname, '/images/', el["Product UID"]+'.jpg');
            require('child_process').execSync('curl -o '+ filepath + ' "'+ url+'"')
            client.assets.upload(
                'image', 
                fs.createReadStream(filepath), 
                {
                    filename: path.basename(filepath)
                }
                ).then(imageAsset => {
                    done(variationOutput(el, {
                        "_type": 'image',
                        "asset": {
                            "_type": "reference",
                            "_ref": imageAsset._id
                        }
                    }))
                }).catch((error)=>{
                    console.log(error);
                    done(variationOutput(el))
                })
        }
        }else{
            done(variationOutput(el))
        }
    }
    
    const combineProduct = (el, done) => {
        console.log(el[0].Product, el.length, 'variations');
        if(el[0].Product === "Create your own poster" ){
            return done()
        }
        let product = addProduct(el[0].Product, el[0].Category, el[0].ID)
        let options = el[0]["Customer options"].split(', ');
        for(let a in options){
            if(controls[options[a]]){
                product.productControls.push(controls[options[a]]);
            }else if(options[a] === 'PagesCount'){
                product.productOptions = [
                    {
                        "_key": nanoid(),
                        "_type": "pageOption",
                        "max": el[0].BindingType.match('stitch') ? 64 : 200,
                        "min": el[0].BindingType.match('glue') ? 30 : 8,
                        "name": {
                            "_type": "translatedString",
                            "en": "Number of pages"
                        },
                        "step": el[0].BindingType.match('stitch') ? 4 : 2
                    }
                ]
            }else{
                console.log('No controls', options[a])
            }
        }
        let productImage = false
        let productVars = [];
        async.forEachOfLimit(el, 1, (element, key, callback)=>{
            console.log('Start', element["Product UID"])
            addVariation(element, (item)=>{
                if(item.preview){
                    productImage = item.preview
                }
                productVars.push(item);
                callback()
            })
        }, ()=>{
            // Handle image preview
            product.productVariants = productVars;
            if(productImage){
                product.productImage.push(productImage);
                product.productImage[0]._key = nanoid();
            }else{
                console.log('No image', product.title.en);
            }
            done(product);
            product = null;
            productVars = null;
        });
    }
    
    const goThroughList = ()=>{
        const list = Object.values(products);
        async.forEachOfLimit(list, 1, (element, key, callback)=>{
            combineProduct(element, (item)=>{
                data.push(item)
                console.log('Done', item.title.en)
                callback();
            })
        }, ()=>{
            fs.writeFileSync(path.join(__dirname, '/sanity-data-2.json'), JSON.stringify(data, null, 2));
            console.log('DONE', list.length);
        })
    }
    
    goThroughList()
    
    
    