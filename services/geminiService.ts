import { GoogleGenAI, Type, Chat } from "@google/genai";
import { UserProfile, GeneratedPlan, HealthLog } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFitnessPlan = async (profile: UserProfile, isRegeneration: boolean = false): Promise<GeneratedPlan> => {
  const modelId = "gemini-3-flash-preview";

  const prompt = `
    Generate a personalized longevity, diet, and fitness plan for the following user:
    Name: ${profile.name}
    Age: ${profile.age}
    Gender: ${profile.gender}
    Height: ${profile.height} cm
    Weight: ${profile.weight} kg
    Activity Level: ${profile.activityLevel}
    Fitness Goal: ${profile.fitnessGoal}
    Food Preference: ${profile.foodPreference}
    Health Issues/Injuries: ${profile.healthIssues || "None"}

    ${isRegeneration ? "IMPORTANT: This is a REGENERATION request. Please provide a COMPLETELY NEW and DIFFERENT set of meals and workout exercises compared to a standard plan. Focus on variety and different healthy options while maintaining the same nutritional goals." : ""}

    As a Longevity & Health Optimization Expert:
    1. Provide a scientifically accurate caloric deficit/surplus calculation.
    2. For the workout, provide a balanced routine focused on both metabolic health and strength.
    3. IMPORTANT: For every meal item, provide specific protein, carbs, and fats content in grams.
    4. Perform a Longevity Analysis:
       - Estimate their biological age based on the provided profile. Be realistic; biological age rarely deviates by more than 10-15 years from chronological age unless there are extreme health conditions.
       - Calculate a Longevity Score (0-100).
       - Identify specific Positive and Negative Impact Factors based on their data (e.g., "Good sleep quality" as positive, "Low daily steps" as negative).
       - Provide 3 key insights for increasing healthspan.
       - Provide 3 specific optimization tips (e.g., supplements, sleep, stress).
  `;

  // ... (rest of the function remains the same)
  // I'll use multi_edit_file if I need to change multiple parts, but for now I'll just replace the whole file content if it's easier or use edit_file for the specific parts.
  // Actually, I'll just use edit_file for the new function at the end.

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
        systemInstruction: "You are an expert longevity coach, fitness trainer, and nutritionist. You provide strict JSON output focused on healthspan optimization.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A motivating summary of the longevity and fitness strategy." },
            longevityAnalysis: {
              type: Type.OBJECT,
              properties: {
                estimatedBiologicalAge: { type: Type.NUMBER },
                longevityScore: { type: Type.NUMBER },
                impactFactors: {
                  type: Type.OBJECT,
                  properties: {
                    positive: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          factor: { type: Type.STRING },
                          impact: { type: Type.STRING, description: "e.g., +5% Health Score" }
                        },
                        required: ["factor", "impact"]
                      }
                    },
                    negative: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          factor: { type: Type.STRING },
                          impact: { type: Type.STRING, description: "e.g., -8% Health Score" }
                        },
                        required: ["factor", "impact"]
                      }
                    }
                  },
                  required: ["positive", "negative"]
                },
                keyInsights: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
                    },
                    required: ["title", "description", "impact"]
                  }
                },
                optimizationTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["estimatedBiologicalAge", "longevityScore", "keyInsights", "optimizationTips"]
            },
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

export const startCoachChat = (user: UserProfile, plan: GeneratedPlan | null, logs: HealthLog[]): Chat => {
  const systemInstruction = `
    You are the LifeLens AI Coach, an elite longevity and health optimization expert. 
    Your mission is to help ${user.name} (Age: ${user.age}, Goal: ${user.fitnessGoal}) achieve maximum healthspan and vitality.

    CONTEXT:
    - User Profile: ${JSON.stringify(user)}
    - Current Plan: ${plan ? JSON.stringify(plan) : 'No plan generated yet.'}
    - Recent Health Logs: ${JSON.stringify(logs.slice(-5))}

    GUIDELINES:
    1. Be highly scientific but accessible. Use terms like "autophagy", "VO2 max", "glycemic load", and "mTOR" when appropriate, but explain them if needed.
    2. Be empathetic and personalized. Reference the user's specific goals and progress.
    3. Focus on actionable longevity protocols (Zone 2 training, resistance training, protein timing, sleep hygiene, stress management).
    4. If the user asks about their progress, analyze their recent logs and provide feedback.
    5. Encourage the user to stick to their plan but be flexible if they have injuries or constraints.
    6. Keep responses concise but information-dense. Use Markdown for clarity (bolding, lists).
    7. If asked about something outside your expertise (like medical diagnosis), provide general health information and advise consulting a professional.

    TONE:
    Professional, encouraging, data-driven, and visionary. You are their partner in the quest for a longer, healthier life.
  `;

  return ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction,
    },
  });
};
