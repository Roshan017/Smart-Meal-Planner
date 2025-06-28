import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    
    def __init__(self):
        self.MONGO_URI = os.getenv("MONGO_URI")
        self.JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
        self.SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")


settings = Settings()