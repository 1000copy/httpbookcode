var fs = require("fs")
// console.log(fs)
function isHeadFile(a){
	return a=="readme.md"
}
function clear(dir){
	var files = fs.readdirSync(dir)
	// files = files.filter(function(a){return !isNaN(parseInt(a)) })
	files = files.filter(function(a){return !isNaN(parseInt(a)) || isHeadFile(a)})
	// console.log(files)
	files = files.sort(
		function(a,b){
			function compare(a,b){
				if (a>b) return 1
				else if (a==b) return 0
				else if (a<b)return -1
				return 0
			}
			if (isHeadFile(a))return -1
			if (isHeadFile(b))return 1
			a = parseInt(a)
			b = parseInt(b)
			return compare(a,b)
			// return compare(parseInt(a) ,parseInt(a))
		})
	return files
}

function joinText(dir,tofile){
	dir += "/"
	var files = clear(dir)
		// console.log(files)
	for (var i = 0 ;i<files.length;i++){
		var a = files[i]
		var f = dir +a
		if (!fs.lstatSync(f).isDirectory()){
		// if (!fs.stats().isDirectory(a))	
			console.log(f)
			fs.appendFileSync(tofile,fs.readFileSync(f)+"\n")
		}
		else{
			joinText(f,tofile)
		
		}
	}
	
}
// files = clear("../")
// console.log(files)

// console.log(joinText("./test/","longlong.txt"))
joinText("../","longlong.txt")

// console.log(parseInt("9."))
// console.log(parseInt("10."))
// console.log(parseInt("1."))
