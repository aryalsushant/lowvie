import asyncio
from dedalus_labs import AsyncDedalus, DedalusRunner
from dotenv import load_dotenv
from dedalus_labs.utils.streaming import stream_async

load_dotenv()

async def main():
    client = AsyncDedalus()
    runner = DedalusRunner(client)

    result = await runner.run(
        input="From this receipt, read it and return the transactions in JSON format categorized into the different vendors. Categorize the things bought from each vendor and the total amount of money spent on each vendor",
        model="openai/gpt-5-mini",
        mcp_servers=["windsor/brave-search-mcp"],
        stream=False
    )

    print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())