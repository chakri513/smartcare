from langchain_community.llms import HuggingFaceHub
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

# Setup HuggingFace (matching our routes.py setup)
hf_token = "hf_XyqNhibxGDnCAp1J1HEyWCLDWcqwGceCFE0"  # Hardcoded token
llm = HuggingFaceHub(repo_id="google/flan-t5-base", huggingfacehub_api_token=hf_token)

# Template for provider summary
prompt = PromptTemplate(
    input_variables=["name", "specialty", "ratings", "experience", "reason"],
    template="""
    A patient is looking at Dr. {name}, a {specialty}, with a rating of {ratings}/5 and {experience} years of experience.
    The reason for visit is: {reason}.

    Give a friendly explanation on:
    1. Why this doctor is a good choice
    2. What the patient can expect during the visit
    """
)

care_chain = LLMChain(llm=llm, prompt=prompt)

def generate_navigation_tip(provider_data, reason):
    return care_chain.run(
        name=provider_data["name"],
        specialty=provider_data["specialty"],
        ratings=provider_data.get("ratings", "4.5"),
        experience=provider_data.get("experience", "10"),
        reason=reason
    )
