import prisma from "./prisma";

async function testConnection(){
    try {
        await prisma.$connect();
        console.log("PostgreSQL connected successfully!");
    } catch (error) {
        console.error("Database connection failed:", error);
    }finally{
        prisma.$disconnect();
    }
}

testConnection();