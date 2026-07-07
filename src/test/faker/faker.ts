import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import URL_MAPPER_MODEL from '../../models/UrlMappers';

// Re-use the pool connection from root file for database connection 
import app from '../../index'


const SEED_COUNT = 100;
const SEED_USER_ID = '6a13439ea7ebe6e40fe51852';

/**
 * Seeds the database with fake URL mapper entries
 * Expecting to return as number 
 * @returns {Promise<number>}
 */
async function seedDbUrl(): Promise<number> {
  const userId = new Types.ObjectId(SEED_USER_ID);
  
  for (let i = 0; i < SEED_COUNT; i++) {
    const fakeUrl = faker.internet.url();
    const fakeDescription = faker.lorem.text();

    await app.request('/api/url_mapper',{
        method: "POST",
        headers: {
            'Authorization':'cf81459d-1b20-42fd-9314-cf9d11d94688' 
        },
        body: JSON.stringify(
            {
                "long_url":fakeUrl,
                "description":fakeDescription,
                "is_active": true
            }
        )
    })
  }

  console.log(`✓ Seeded ${SEED_COUNT} URL mapper entries`);
  return SEED_COUNT;
}

seedDbUrl().catch(console.error);