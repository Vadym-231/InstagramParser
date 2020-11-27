const mongoose = require('mongoose')

const parseField = mongoose.Schema({
  data:{
      type:Array,
      default:[]
  }
})
const parseField_ = mongoose.Schema({
    id: {
        type: Number,
        default:'0'
    },
    username:{
        type: String,
        default:'none'
    },
    full_name:{
        type:String,
        default:'none'
    },
    profile_pic_url:{
        type:String,
        default:'none'
    },
    followed_by_viewer:{
        type:Boolean,
        default:false
    },
    requested_by_viewer:{
      type:Boolean,
      default:false
    },
    is_verified:{
        type:Boolean,
        default:false
    }
})

const parse = mongoose.model('parseField', parseField)

module.exports = parse