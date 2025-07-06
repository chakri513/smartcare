from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.smartcare

entry_collection = database.get_collection("submissions")  # fix typo if needed
appointment_collection = database.get_collection("appointments")
cost_estimation_collection = database.get_collection("cost_estimations")

button_click_collection = database.get_collection("button_clicks")
ai_query_log_collection = database.get_collection("ai_query_logs")
care_tip_access_collection = database.get_collection("care_tip_accesses")
error_log_collection = database.get_collection("error_logs")
