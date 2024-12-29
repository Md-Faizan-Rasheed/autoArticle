import  { useState } from 'react';
// import { db } from '../service/fibrebase';
// import { doc, setDoc } from "firebase/firestore";
import { Document, Packer, Paragraph,HeadingLevel, TextRun } from "docx";
import axios from 'axios';
import {
    AI_PROMPT
  } from "@/constants/options";
  import { chatSession } from "@/service/Aimodel";


const StartupForm = () => {
    // const [wordFileData, setWordFileData] = useState(null); // Add this state
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    organizationName: '',
    aboutYourself: '',
    inspiration: '',
    marketGaps: '',
    coFounders: '',
    vision: '',
    mission: '',
    productsServices: '',
    challenges: '',
    turningPoint: '',
    proudestMoment: '',
    companyCulture: '',
    industryTrends: '',
    futurePlans: '',
    advice: '',
    retrospective: '',
    additionalInfo: '',
    websiteLink: '',
    linkedInLink: '',
    picture: null, // To store the uploaded file
  });
  const [isSubmitted, setIsSubmitted] = useState(false);


  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://artclgen-default-rtdb.firebaseio.com/userData.json",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log("Fetched Data:", data);

        // Optionally, you can process the data
        const processedData = Object.keys(data).map((key) => ({
          id: key, // Firebase unique key
          ...data[key],
        }));
        console.log("Processed Data:", processedData);
      } else {
        console.error("Failed to fetch data:", await res.text());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
}


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setFormData({
      ...formData,
      picture: file,
    });
  };

// **********************3***********************
const generateWordFromJson = async (text) => {
  // console.log("Form DAta:-",formData.name)
  const datao = text;
  const pdata = datao.replace(/```json|```/g, '');
  const data = JSON.parse(pdata);

  const { article_title, article_body, conclusion } = data;

  if (!Array.isArray(article_body)) {
    console.error("article_body is not an array:", article_body);
    return;
  }

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: article_title,
            heading: HeadingLevel.HEADING_1,
            alignment: "center",
          }),
          ...article_body.map((section) => [
            new Paragraph({
              text: section.heading,
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: section.paragraph,
            }),
          ]).flat(),
          new Paragraph({
            text: "Conclusion",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: conclusion[0].text,
          }),
          ...conclusion[0].links.map((link) =>
            new Paragraph({
              children: [
                new TextRun({ text: `${link.link_text}: `, bold: true }),
                new TextRun({
                  text: link.url,
                  color: "0000FF",
                  underline: true,
                }),
              ],
            })
          ),
        ],
      },
    ],
  });

  try {
    console.log("Form DAta:-",formData.name)
    // Convert the document to a Blob
    const blob = await Packer.toBlob(doc);

    // Prepare the file for upload
    const uploadData = new FormData();
    // uploadData.append("file", new File([blob],`${formData.organizationName}`));
    uploadData.append("file", new File([blob], `${formData.organizationName}.docx`, {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })
  );
    uploadData.append("image",formData.picture); // Append the image
    uploadData.append("to", "sarfrazkhan416@gmail.com");
    uploadData.append("subject", "ArticleOfFounders");
    uploadData.append(
      "htmlContent",
      `<h1>Hi I am ${formData.name} from ${formData.organizationName}</h1>`
    );

    // Send the file to the backend
    const response = await axios.post("http://localhost:5000/send-email", uploadData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Email Sent: ", response.data);
  } catch (error) {
    console.error("Error occurred:", error);
  }
};
// **********************3end***********************

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("https://artclgen-default-rtdb.firebaseio.com/userData.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Use the correct case
      },
      body: JSON.stringify(formData), // Directly serialize the formData
    });

    if (res.ok) {
      // console.log("Data submitted successfully!");
      fetchData();
      setIsSubmitted(true); // Set submission status to true

    } else {
      console.error("Failed to submit data:", await res.text());
    }
  } catch (error) {
    console.error("Error submitting data:", error);
  }

  const FINAL_PROMPT = AI_PROMPT
    .replace("{name}", formData?.name || "N/A")
    .replace("{contactNumber}", formData?.contactNumber || "N/A")
    .replace("{email}", formData?.email || "N/A")
    .replace("{organizationName}", formData?.organizationName || "N/A")
    .replace("{aboutYourself}", formData?.aboutYourself || "N/A")
    .replace("{inspiration}", formData?.inspiration || "N/A")
    .replace("{marketGaps}", formData?.marketGaps || "N/A")
    .replace("{coFounders}", formData?.coFounders || "N/A")
    .replace("{vision}", formData?.vision || "N/A")
    .replace("{mission}", formData?.mission || "N/A")
    .replace("{productsServices}", formData?.productsServices || "N/A")
    .replace("{challenges}", formData?.challenges || "N/A")
    .replace("{turningPoint}", formData?.turningPoint || "N/A")
    .replace("{proudestMoment}", formData?.proudestMoment || "N/A")
    .replace("{companyCulture}", formData?.companyCulture || "N/A")
    .replace("{industryTrends}", formData?.industryTrends || "N/A")
    .replace("{futurePlans}", formData?.futurePlans || "N/A")
    .replace("{advice}", formData?.advice || "N/A")
    .replace("{retrospective}", formData?.retrospective || "N/A")
    .replace("{additionalInfo}", formData?.additionalInfo || "N/A")
    .replace("{websiteLink}", formData?.websiteLink || "N/A")
    .replace("{linkedInLink}", formData?.linkedInLink || "N/A");

  const result = await chatSession.sendMessage(FINAL_PROMPT);

  const responseText = result?.response?.text() || "No Response";

  // Generate Word file from response
  generateWordFromJson(responseText);
};

  return (
    <div>
      {isSubmitted ? (
        // <div>
        //   <h1>Your response has been recorded!</h1>
        //   <p>Our team will contact you soon. Thank you for reaching out!</p>
        // </div>
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🎉 Your Response Has Been Recorded!</h1>
          <p className="text-lg text-gray-600">
            Our team will contact you soon. Thank you for reaching out!
          </p>
          <div className="mt-6">
          <button
  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
  onClick={() => (window.location.href = "https://startuptimes.net/")}
>
              Go Back to Home
            </button>
          </div>
        </div>
      </div>
      ) : (
    //  <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
    //   <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Startup Founder Questionnaire</h2>
    //   <form onSubmit={handleSubmit} className="space-y-6">
    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">What is your Name?</label>
    //       <input
    //       placeholder="Jon Doe"
    //         type="text"
    //         name="name"
    //         value={formData.name}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         required
    //       />
    //     </div>
    //     <div>
    //     <label className="block text-gray-700 font-medium mb-2">Upload your picture (e.g., logo, project image)</label>
    //     <input
    //       type="file"
    //       name="picture"
    //       onChange={handleFileChange}
    //       accept="image/*"
    //       className="block w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer focus:ring focus:ring-blue-300"
    //     />
    //     {formData.picture && (
    //       <div className="mt-2">
    //         <p>Selected File: {formData.picture.name}</p>
    //         <img
    //           src={URL.createObjectURL(formData.picture)}
    //           alt="Preview"
    //           className="mt-2 w-32 h-32 object-cover border border-gray-300 rounded-lg"
    //         />
    //       </div>
    //     )}
    //   </div>
    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
    //       <input
    //         type="text"
    //         name="contactNumber"
    //         value={formData.contactNumber}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">Email ID</label>
    //       <input
    //         type="email"
    //         name="email"
    //         value={formData.email}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         required
    //       />
    //     </div>

    //      <div>
    //       <label className="block text-gray-700 font-medium mb-2">What is your organization Name?</label>
    //       <input
    //         type="text"
    //         name="organizationName"
    //         value={formData.organizationName}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">Can you tell us a bit about yourself and your professional background?</label>
    //       <textarea
    //         name="aboutYourself"
    //         value={formData.aboutYourself}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">What inspired you to start this venture?</label>
    //       <textarea
    //         name="inspiration"
    //         value={formData.inspiration}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">What challenges or gaps in the market did you notice that led to the creation of your startup?</label>
    //       <textarea
    //         name="marketGaps"
    //         value={formData.marketGaps}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">Did you have a co-founder or early team that helped you build the foundation? How did you come together?</label>
    //       <textarea
    //         name="coFounders"
    //         value={formData.coFounders}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">What is the vision behind your startup, and what problem are you solving for your customers?</label>
    //       <textarea
    //         name="vision"
    //         value={formData.vision}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">How has your mission evolved since the inception of the company?</label>
    //       <textarea
    //         name="mission"
    //         value={formData.mission}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">Can you describe the products/services your startup offers? How do they stand out in the market?</label>
    //       <textarea
    //         name="productsServices"
    //         value={formData.productsServices}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">What were some of the major challenges you faced while building your startup, and how did you overcome them?</label>
    //       <textarea
    //         name="challenges"
    //         value={formData.challenges}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">What was the biggest turning point or milestone that marked a breakthrough for your company?</label>
    //       <textarea
    //         name="turningPoint"
    //         value={formData.turningPoint}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">What has been your proudest moment as a founder so far?</label>
    //       <textarea
    //         name="proudestMoment"
    //         value={formData.proudestMoment}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">How would you describe your company culture? What makes your workplace unique?</label>
    //       <textarea
    //         name="companyCulture"
    //         value={formData.companyCulture}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">What trends in your industry do you find most exciting or challenging right now?</label>
    //       <textarea
    //         name="industryTrends"
    //         value={formData.industryTrends}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">What are your future plans for the startup? Where do you see the company in the next 5 years?</label>
    //       <textarea
    //         name="futurePlans"
    //         value={formData.futurePlans}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //    </div>

    //    <div>
    //       <label className="block text-gray-700 font-medium mb-2">What advice would you give to aspiring entrepreneurs who are just starting out?</label>
    //       <textarea
    //         name="advice"
    //         value={formData.advice}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">Looking back, what would you have done differently in your entrepreneurial journey?</label>
    //       <textarea
    //         name="retrospective"
    //         value={formData.retrospective}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">Is there anything else you’d like to share about your journey or your company’s story?</label>
    //       <textarea
    //         name="additionalInfo"
    //         value={formData.additionalInfo}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         rows="4"
    //       />
    //     </div>
        

    //      <div>
    //       <label className="block text-gray-700 font-medium mb-2">Website Link</label>
    //       <input
    //         type="url"
    //         name="websiteLink"
    //         value={formData.websiteLink}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-gray-700 font-medium mb-2">LinkedIn Link</label>
    //       <input
    //         type="url"
    //         name="linkedInLink"
    //         value={formData.linkedInLink}
    //         onChange={handleChange}
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
    //         required
    //       />
    //     </div> 

    //     <div className="text-center">
    //       <button
    //         type="submit"
    //         className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
    //       >
    //         Submit
    //       </button>
    //     </div>
    //   </form>
    //   {/* {wordFileData && <Wordfile data={wordFileData} />}  */}
    //   {/* {wordFileData && <WordFileGenerator data={wordFileData} />}  */}

    // </div>
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
  <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Startup Founder Questionnaire</h2>
  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label className="block text-gray-700 font-medium mb-2">What is your Name?</label>
      <input
        placeholder="Jon Doe"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        required
      />
    </div>
    <div>
      <label className="block text-gray-700 font-medium mb-2">Upload your picture (e.g., logo, project image)</label>
      <input
        type="file"
        name="picture"
        onChange={handleFileChange}
        accept="image/*"
        className="block w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer focus:ring focus:ring-blue-300"
      />
      {formData.picture && (
        <div className="mt-2">
          <p>Selected File: {formData.picture.name}</p>
          <img
            src={URL.createObjectURL(formData.picture)}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover border border-gray-300 rounded-lg"
          />
        </div>
      )}
    </div>
    <div>
      <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
      <input
        placeholder="+1 123-456-7890"
        type="text"
        name="contactNumber"
        value={formData.contactNumber}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">Email ID</label>
      <input
        placeholder="example@domain.com"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">What is your organization Name?</label>
      <input
        placeholder="Startup Name Inc."
        type="text"
        name="organizationName"
        value={formData.organizationName}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">Can you tell us a bit about yourself and your professional background?</label>
      <textarea
        placeholder="Write about your experience and background here..."
        name="aboutYourself"
        value={formData.aboutYourself}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">What inspired you to start this venture?</label>
      <textarea
        placeholder="Share your inspiration for starting the venture..."
        name="inspiration"
        value={formData.inspiration}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>
    <div>
      <label className="block text-gray-700 font-medium mb-2">What challenges or gaps in the market did you notice that led to the creation of your startup?</label>
      <textarea
        placeholder="Describe the market gaps or challenges you addressed..."
        name="marketGaps"
        value={formData.marketGaps}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">Did you have a co-founder or early team that helped you build the foundation? How did you come together?</label>
      <textarea
        placeholder="Share details about your co-founder or early team..."
        name="coFounders"
        value={formData.coFounders}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">What is the vision behind your startup, and what problem are you solving for your customers?</label>
      <textarea
        placeholder="Explain your startup's vision and the problems it solves..."
        name="vision"
        value={formData.vision}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">How has your mission evolved since the inception of the company?</label>
      <textarea
        placeholder="Describe the evolution of your company's mission..."
        name="mission"
        value={formData.mission}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">Can you describe the products/services your startup offers? How do they stand out in the market?</label>
      <textarea
        placeholder="Explain your products/services and their uniqueness..."
        name="productsServices"
        value={formData.productsServices}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">What were some of the major challenges you faced while building your startup, and how did you overcome them?</label>
      <textarea
        placeholder="Share the challenges you faced and how you overcame them..."
        name="challenges"
        value={formData.challenges}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">What was the biggest turning point or milestone that marked a breakthrough for your company?</label>
      <textarea
        placeholder="Describe a turning point or milestone in your journey..."
        name="turningPoint"
        value={formData.turningPoint}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>
    <div>
      <label className="block text-gray-700 font-medium mb-2">What has been your proudest moment as a founder so far?</label>
      <textarea
        placeholder="Share your proudest moment as a founder..."
        name="proudestMoment"
        value={formData.proudestMoment}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">How would you describe your company culture? What makes your workplace unique?</label>
      <textarea
        placeholder="Describe your company culture and workplace uniqueness..."
        name="companyCulture"
        value={formData.companyCulture}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">What trends in your industry do you find most exciting or challenging right now?</label>
      <textarea
        placeholder="Discuss exciting or challenging trends in your industry..."
        name="industryTrends"
        value={formData.industryTrends}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">What are your future plans for the startup? Where do you see the company in the next 5 years?</label>
      <textarea
        placeholder="Share your future plans and vision for the next 5 years..."
        name="futurePlans"
        value={formData.futurePlans}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">What advice would you give to aspiring entrepreneurs who are just starting out?</label>
      <textarea
        placeholder="Write your advice for aspiring entrepreneurs..."
        name="advice"
        value={formData.advice}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">Looking back, what would you have done differently in your entrepreneurial journey?</label>
      <textarea
        placeholder="Reflect on what you would have done differently..."
        name="retrospective"
        value={formData.retrospective}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">Is there anything else you’d like to share about your journey or your company’s story?</label>
      <textarea
        placeholder="Add any additional information you'd like to share..."
        name="additionalInfo"
        value={formData.additionalInfo}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        rows="4"
      />
    </div>
    
    <div>
      <label className="block text-gray-700 font-medium mb-2">Website Link</label>
      <input
        placeholder="https://yourwebsite.com"
        type="url"
        name="websiteLink"
        value={formData.websiteLink}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        required
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">LinkedIn Link</label>
      <input
        placeholder="https://linkedin.com/in/yourprofile"
        type="url"
        name="linkedInLink"
        value={formData.linkedInLink}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        required
      />
    </div>

    <button
      type="submit"
      className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
    >
      Submit
    </button>
  </form>
</div>

      )}
    </div>

  );
};

export default StartupForm;
