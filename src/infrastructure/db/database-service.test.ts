import { DatabaseService } from './database-service';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { getInitialSchema } from './schema-registry';

jest.mock('lowdb', () => ({
  Low: jest.fn(),
}));
jest.mock('lowdb/node', () => ({
  JSONFile: jest.fn(),
}));
jest.mock('./schema-registry');
jest.mock('path', () => ({
  join: jest.fn(() => 'mock/path/data.json'),
}));

describe('DatabaseService', () => {
  let mockDb: Partial<Low<any>>;

  beforeEach(() => {
    mockDb = {
      read: jest.fn(),
      write: jest.fn(),
      data: undefined,
    };

    // Mock JSONFile constructor
    (JSONFile as jest.Mock).mockImplementation(() => ({
      dummy: 'adapter',
    }));

    // Mock Low constructor to return mockDb
    (Low as jest.Mock).mockImplementation((_adapter, _defaultData) => mockDb);

    // Mock getInitialSchema
    (getInitialSchema as jest.Mock).mockReturnValue({
      topics: [],
      users: [],
      resources: [],
    });

    // Clear singleton
    (DatabaseService as any).instance = undefined;
  });

  it('should initialize database with defaults and return instance', async () => {
    const db = await DatabaseService.getInstance();

    expect(JSONFile).toHaveBeenCalledWith('mock/path/data.json');
    expect(Low).toHaveBeenCalled();

    expect(mockDb.read).toHaveBeenCalled();
    expect(mockDb.write).toHaveBeenCalled();

    expect(mockDb.data).toBeDefined();
    expect(mockDb.data!.topics).toEqual([]);
    expect(mockDb.data!.users).toEqual([]);
    expect(mockDb.data!.resources).toEqual([]);

    expect(db).toBe(mockDb);
  });

  it('should return the same instance on second call', async () => {
    const first = await DatabaseService.getInstance();
    const second = await DatabaseService.getInstance();

    expect(first).toBe(second);
    expect(mockDb.read).toHaveBeenCalledTimes(1);
    expect(mockDb.write).toHaveBeenCalledTimes(1); // only first time
  });
});
