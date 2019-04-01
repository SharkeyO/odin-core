import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

class GeneratorService {
  constructor(private global: any) { }

  generateModules(specific: any) {
    return specific;
  }
}
