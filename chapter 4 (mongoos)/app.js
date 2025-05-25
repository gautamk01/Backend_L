const mongoose = require("mongoose");

mongoose
  .connect("")
  .then(() => console.log("database is connceted Successfully"))
  .catch((e) => console.log(e));

//SChema creatation
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  isActive: Boolean,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

//user model
const User = mongoose.model("User", userSchema);

async function runQuerysExamples(name, email, age, isActive, tags) {
  try {
    //create a new documnet
    //Methord 1
    const newUser = await User.create({
      name: name,
      email: email,
      age: age,
      isActive: isActive,
      tags: tags,
    });

    //Methord 2
    // const newUser = new User({
    //   name: "Gauri",
    //   email: "Gauri@gmail.coom",
    //   age: 32,
    //   isActive: true,
    //   tags: ["designer"],
    // });
    // await newUser.save();

    console.log("created a New User ", newUser);
  } catch (e) {
    console.log("Error ->", e);
  } finally {
    mongoose.connection.close();
  }
}

async function runQuerysExample2() {
  try {
    //Finding the all data we have uploaded
    //
    const getting_all_user = await User.find();
    console.log(getting_all_user);
  } catch (e) {
    console.log("Error -> ", e);
  } finally {
    await mongoose.connection.close();
  }
}

//select the user where isActive is False
async function runQuerysExample3() {
  try {
    const getUserofActiveFalse = await User.find({ isActive: true });
    console.log(getUserofActiveFalse.length);
  } catch (e) {
    console.log(e);
  } finally {
    await mongoose.connection.close();
  }
}
//select only one user
async function runQuerysExample4() {
  try {
    const getOneUser = await User.findOne({ name: "lary page" });
    console.log(getOneUser);
  } catch (e) {
    console.log(e);
  } finally {
    await mongoose.connection.close();
  }
}

//we are selecting the name and email and we are avoiding the id  for that we use -
async function runQuerysExample5() {
  try {
    const selectField = await User.find().select("name email -_id");
    // const selectField = await User.find()
    //   .limit(5)
    //   .skip(1)
    //   .select("name email -_id");
    console.log(selectField);
  } catch (e) {
    console.log(e);
  } finally {
    await mongoose.connection.close();
  }
}

//this is a function used for sorting the retrival infromation
//1 is for ascending
//-1 for decending
async function runQuerysExample6() {
  try {
    const selectField = await User.find().sort({ age: 1 });
    console.log(selectField);
    // const selectField = await User.find()
    //   .limit(5)
    //   .skip(1)
    //   .select("name email -_id");
    console.log(selectField);
  } catch (e) {
    console.log(e);
  } finally {
    await mongoose.connection.close();
  }
}

//THis function is mainly to find the count of the number of tuples
async function runQuerysExample7() {
  try {
    const count_documents = await User.countDocuments({ isActive: false });
    console.log(count_documents);
  } catch (e) {
    console.log(e);
  } finally {
    await mongoose.connection.close();
  }
}

//Delete the User
async function runQuerysExample8() {
  try {
    const deletedUserByID = await User.findByIdAndDelete(
      "682563992e6c07d5bafba063"
    );
    console.log(deletedUserByID);
  } catch (e) {
    console.log(e);
  } finally {
    await mongoose.connection.close();
  }
}

//Update
async function runQuerysExample9() {
  try {
    const updateUser = await User.findByIdAndUpdate(
      "6825651dae10c2f7e2d2bc10",
      {
        $set: { age: 100 }, // set is mainly used to update the existing values in the section
        $push: { tags: "updated" },
      },
      { new: true }
    );
    console.log(updateUser, "this is updated user");
  } catch (e) {
    console.log(e);
  } finally {
    await mongoose.connection.close();
  }
}

runQuerysExample9();
