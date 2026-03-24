import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, GeneratedPlan } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFitnessPlan = async (profile: UserProfile): Promise<GeneratedPlan> => {
  const modelId = "gemini-2.5-flash";

  const prompt = `
    Generate a personalized diet and fitness plan for the following user:
    Name: ${profile.name}
    Age: ${profile.age}
    Gender: ${profile.gender}
    Height: ${profile.height} cm
    Weight: ${profile.weight} kg
    Activity Level: ${profile.activityLevel}
    Fitness Goal: ${profile.fitnessGoal}
    Food Preference: ${profile.foodPreference}
    Health Issues/Injuries: ${profile.healthIssues || "None"}

    Provide a scientifically accurate caloric deficit/surplus calculation based on the goal.
    For the workout, provide a balanced routine suitable for their level.
    IMPORTANT: For every meal item, you must provide the specific protein, carbs, and fats content in grams.
  `;

  // Helper for item schema to avoid repetition
  const mealItemSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      calories: { type: Type.NUMBER },
      description: { type: Type.STRING },
      protein: { type: Type.NUMBER, description: "grams of protein in this item" },
      carbs: { type: Type.NUMBER, description: "grams of carbs in this item" },
      fats: { type: Type.NUMBER, description: "grams of fats in this item" }
    },
    required: ["name", "calories", "description", "protein", "carbs", "fats"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert fitness coach and nutritionist. You provide strict JSON output.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A motivating summary of the strategy." },
            dietPlan: {
              type: Type.OBJECT,
              properties: {
                hydrationTips: { type: Type.STRING },
                dailyMacros: {
                  type: Type.OBJECT,
                  properties: {
                    protein: { type: Type.NUMBER, description: "grams" },
                    carbs: { type: Type.NUMBER, description: "grams" },
                    fats: { type: Type.NUMBER, description: "grams" },
                    totalCalories: { type: Type.NUMBER }
                  },
                  required: ["protein", "carbs", "fats", "totalCalories"]
                },
                sampleDay: {
                  type: Type.OBJECT,
                  properties: {
                    breakfast: {
                      type: Type.ARRAY,
                      items: mealItemSchema
                    },
                    lunch: {
                      type: Type.ARRAY,
                      items: mealItemSchema
                    },
                    dinner: {
                      type: Type.ARRAY,
                      items: mealItemSchema
                    },
                    snacks: {
                      type: Type.ARRAY,
                      items: mealItemSchema
                    }
                  }
                }
              },
              required: ["dailyMacros", "sampleDay"]
            },
            workoutPlan: {
              type: Type.OBJECT,
              properties: {
                frequency: { type: Type.STRING, description: "e.g., 4 days a week" },
                routine: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      dayName: { type: Type.STRING },
                      exercises: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            sets: { type: Type.STRING },
                            reps: { type: Type.STRING },
                            notes: { type: Type.STRING }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedPlan;
    }
    throw new Error("No response generated");

  } catch (error) {
    console.error("Error generating plan:", error);
    throw new Error("Failed to generate fitness plan. Please try again.");
  }
};