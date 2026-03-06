// MinimalHangTest.test.ts
import mongoose from 'mongoose';

import {describe, beforeAll, afterAll, beforeEach, afterEach, it, expect} from 'bun:test'
// Assume you have simple dbConnection/disconnectDB/UserModel imports

import dbConnection, {disconnectDB} from '../database/dbConnection';

import UserModel from '../models/Users';

describe('Mongoose Hook Hang Test', () => {
    beforeAll(async () => {
        await dbConnection();
        // await UserModel.syncIndexes();
    });

    afterAll(async () => {
        await disconnectDB();
    });

    beforeEach(async () => {
        // Create only the absolute minimum that triggers the index
        await UserModel.create({ username: 'test_user', password: 'password', name: 'Test' });
    });

    afterEach(async () => {
        console.log('--- AFTEREACH: Starting delete ---');
        await UserModel.deleteOne({}); // THIS IS THE HANG POINT
        console.log('--- AFTEREACH: Delete finished ---');
    });

    it('should pass if hooks run cleanly', () => {
        expect(true).toBe(true);
    });
});

// bun test src/test/minimalHang.test.ts