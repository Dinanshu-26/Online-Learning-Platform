// const mongoose = require("mongoose");

// const tagsSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//     },
//     course: [
//         {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Course"
//     },
//     ],
// });

// module.exports = mongoose.model("Tag",tagsSchema) ;

const mongoose = require("mongoose");

// Define the Tags schema
const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: { type: String },
	courses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
		},
	],
});

// Export the Tags model
module.exports = mongoose.model("Category", categorySchema);