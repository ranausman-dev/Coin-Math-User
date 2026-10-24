import { db } from "../components/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";

const checkEmailExists = async (email) => {
  try {
    if (!email || typeof email !== "string") {
      console.error("Invalid email provided:", email);
      return null;
    }

    const emailQuery = query(
      collection(db, "profiles"),
      where("email", "==", email)
    );

    const emailSnapshot = await getDocs(emailQuery);

    if (!emailSnapshot.empty) {
      const userData = emailSnapshot.docs[0].data();
      const userId = emailSnapshot.docs[0].id;
      return { userData, userId };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error in checkEmailExists:", error);
    throw error;
  }
};

export default checkEmailExists;
