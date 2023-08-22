// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { Module } from '@nestjs/common';
// import { GraphQLModule } from '@nestjs/graphql';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { PostModule } from './apis/posts/post.module';
// import { CommentModule } from './apis/comments/comment.module';
// import { UsersModule } from './apis/users/user.module';
// import { AuthModule } from './apis/auth/auth.module';
// import { FileModule } from './apis/fileUpload/upload.module';
// @Module({
//   imports: [
//     PostModule,
//     CommentModule,
//     UsersModule,
//     AuthModule,
//     FileModule,
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'root',
//       password: '794279',
//       database: 'community',
//       autoLoadEntities: true,
//       entities: [__dirname + '/apis/posts/entities/*.entity.*'],
//       synchronize: true,
//     }),
//     GraphQLModule.forRoot<ApolloDriverConfig>({
//       driver: ApolloDriver,
//       autoSchemaFile: 'src/comons/graphql/schema.gql',
//     }),
//   ],
//   providers: [],
// })
// export class AppModule {}

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './apis/posts/post.module';
import { CommentModule } from './apis/comments/comment.module';
import { UsersModule } from './apis/users/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { FileModule } from './apis/fileUpload/upload.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { CassandraService } from './cassandra/cassandra.service';
import { LikeModule } from './apis/like/like.module';


@Global()
@Module({
  imports: [
    PostModule,
    CommentModule,
    UsersModule,
    AuthModule,
    FileModule,
    LikeModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '794279',
      database: 'community',
      autoLoadEntities: true,
      entities: [__dirname + '/apis/posts/entities/*.entity.*'],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
        'subscriptions-transport-ws': true,
      },
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
  providers: [
    // CassandraService,
    // {
    //   provide: ScalarsExplorerService,
    //   useFactory: (modulesContainer: ModulesContainer) => {
    //     return new ScalarsExplorerService(modulesContainer, {
    //       scalarsMap: [{ type: GraphQLUpload, scalar: GraphQLUpload }],
    //     });
    //   },
    //   inject: [ModulesContainer],
    // },

  ],
  exports: [
    // CassandraService, //
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  // }
}
