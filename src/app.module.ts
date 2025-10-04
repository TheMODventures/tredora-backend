import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { EmailModule } from './email/email.module';
import { BankModule } from './bank/bank.module';
import { FormBuilderModule } from './form-builder/form-builder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    TokenModule,
    EmailModule,
    BankModule,
    FormBuilderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
