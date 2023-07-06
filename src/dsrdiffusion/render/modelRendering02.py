#!/usr/bin/python
# -*- coding: UTF-8 -*-
import math
import sys
import os
import json
import bpy
import time
from bpy import context
import mathutils
from mathutils import Matrix

# # 下面这三句代码用于 background 运行时，能正常载入自定义python module
# dir = os.path.dirname(bpy.data.filepath)
# if not dir in sys.path:
#     sys.path.append(dir )
#     # print(sys.path)

# import meshObjScaleUtils


def toTuplesByStepN(datals, stepN = 4):
    ds = tuple(datals)
    rds = tuple(ds[i:i + stepN] for i in range(0, len(ds), stepN))
    return rds

def getJsonObjFromFile(path):
    file = open(path,'rb')
    jsonDataStr = file.read()
    # print("jsonDataStr: \n", jsonDataStr)
    jsonObj = json.loads(jsonDataStr)
    return jsonObj


def rgbUint24ToFloat3(rgbUint24):

    # print('rgbUint24ToFloat3() rgbUint24: ', rgbUint24)
    # print('rgbUint24ToFloat3() rgbUint24: ', hex(rgbUint24))

    bit = 0xff
    r = ((rgbUint24 >> 16) & bit) / 255.0
    g = ((rgbUint24 >> 8) & bit) / 255.0
    b = (rgbUint24 & bit) / 255.0
    return (r, g, b)

class RenderingNodeMaterial:
    __type__ = ''
    type = 'default'
    modelName = ''
    color = (1.0, 1.0, 1.0)
    specular = 0.5
    metallic =  0.5
    roughness =  0.5
    normalStrength =  1.0
    uvScales =  (1.0, 1.0)
    rootDir = ''
    taskRootDir = ''
    def __init__(self):
        __type__ = 'RenderingNodeMaterial'
    def buildFromJsonObj(self, jsonObj):
        # print('RenderingNodeMaterial::buildFromJsonObj() ..., ', jsonObj)
        if 'type' in jsonObj:
           self.type = jsonObj['type']
        if 'color' in jsonObj:
           self.color = rgbUint24ToFloat3( jsonObj['color'] )
        if 'specular' in jsonObj:
           self.specular = jsonObj['specular']
        if 'roughness' in jsonObj:
           self.roughness = jsonObj['roughness']
        if 'normalStrength' in jsonObj:
           self.normalStrength = jsonObj['normalStrength']
        if 'uvScales' in jsonObj:
           self.uvScales = jsonObj['uvScales']
class RenderingNodeCamera:
    __type__ = ''
    __updated__ = False
    type = 'perspective'
    viewAngle = 45
    near = 0.1
    far = 20
    matrix = []
    rootDir = ''
    taskRootDir = ''
    def __init__(self):
        __type__ = 'RenderingNodeCamera'
    def isUpdated(self):
        return self.__updated__
    def buildFromJsonObj(self, jsonObj):
        print('RenderingNodeCamera::buildFromJsonObj() ... TTTTTTTTTTTTTTTTTTT')
        # print('RenderingNodeCamera::buildFromJsonObj() ..., ', jsonObj)
        if 'type' in jsonObj:
           self.type = jsonObj['type']
        if 'viewAngle' in jsonObj:
           self.viewAngle = jsonObj['viewAngle']
        if 'near' in jsonObj:
           self.near = jsonObj['near']
        if 'far' in jsonObj:
           self.far = jsonObj['far']
        if 'matrix' in jsonObj:
           self.matrix = jsonObj['matrix']
        self.__updated__ = True
    def apply(self):
        print('RenderingNodeCamera::apply() self.isUpdated(): ', self.isUpdated())
        if not self.isUpdated():
            return False
        # taskObj = cfg.configObj["task"]
        camera_object = bpy.data.objects["Camera"]
        if len(self.matrix) == 16:
            cdvsList = toTuplesByStepN(self.matrix)
            px = cdvsList[0][3]
            py = cdvsList[1][3]
            pz = cdvsList[2][3]
            dis = px * px + py * py + pz * pz
            if(dis > 0.01):
                cam_world_matrix = Matrix()
                cam_world_matrix[0] = cdvsList[0]
                cam_world_matrix[1] = cdvsList[1]
                cam_world_matrix[2] = cdvsList[2]
                cam_world_matrix[3] = cdvsList[3]

                camera_object.matrix_world = cam_world_matrix
                #
        camera_object.data.angle = math.pi * self.viewAngle/180.0
        camera_object.data.clip_start = self.near
        camera_object.data.clip_end = self.far
        print('RenderingNodeCamera::apply() ...')
        return True


class RenderingNodeEnv:
    __type__ = ''
    type = ''
    path = ''
    rotation = 0
    bgTransparent = False
    rootDir = ''
    taskRootDir = ''
    def __init__(self):
        __type__ = 'RenderingNodeEnv'
    def buildFromJsonObj(self, jsonObj):
        # print('RenderingNodeEnv::buildFromJsonObj() ..., ', jsonObj)
        if 'type' in jsonObj:
           self.type = jsonObj['type']
        if 'path' in jsonObj:
           self.path = jsonObj['path']
        if 'rotation' in jsonObj:
           self.rotation = jsonObj['rotation']
    def apply(self):
        bpy.context.scene.render.film_transparent = self.bgTransparent
        bpy.context.scene.world.use_nodes = True

        envHdrFilePath = ""
        if self.path == "":
            print("### self.rootDir: ", self.rootDir)
            envHdrFilePath = self.rootDir + "static/common/env/default.hdr"
        else:
            envHdrFilePath = self.path

        if envHdrFilePath != "":
            bg_tree = bpy.context.scene.world.node_tree
            # bg_tree.nodes is bpy.types.Nodes type
            bg_node = bg_tree.nodes.new(type='ShaderNodeTexEnvironment')
            # bg_node.location = (-300, 300)
            bg_node.select = True
            bg_tree.nodes.active = bg_node
            # Load the environment texture file
            # bg_node.image = bpy.data.images.load(taskRootDir + 'voxblender/models/box.jpg')
            bg_node.image = bpy.data.images.load(envHdrFilePath)
            # Connect the environment texture to the background output
            bg_output = bg_tree.nodes['Background']
            bg_output.inputs['Strength'].default_value = 0.5
            bg_tree.links.new(bg_node.outputs['Color'], bg_output.inputs['Color'])
class RenderingNodeOutput:
    __type__ = ''
    path = ''
    resolution = [512,512]
    bgTransparent = False
    outputType = 'single_image'
    bgColor = (1.0, 1.0, 1.0)
    rootDir = ''
    taskRootDir = ''
    def __init__(self):
        __type__ = 'RenderingNodeOutput'
    def buildFromJsonObj(self, jsonObj):
        # print('RenderingNodeOutput::buildFromJsonObj() ..., ', jsonObj)
        if 'output' in jsonObj:
           self.path = jsonObj['path']
        if 'resolution' in jsonObj:
           self.resolution = jsonObj['resolution']
        if 'bgTransparent' in jsonObj:
           self.bgTransparent = jsonObj['bgTransparent'] == 1
        if 'outputType' in jsonObj:
           self.outputType = jsonObj['outputType']
        if 'bgColor' in jsonObj:
           self.bgColor = rgbUint24ToFloat3( jsonObj['bgColor'] )
           print('RenderingNodeOutput::buildFromJsonObj() self.bgColor: ', self.bgColor)
        #
		#
    def apply(self):
        path = self.path
        renderer = bpy.context.scene.render
        if self.bgTransparent:
            renderer.image_settings.file_format='PNG'
            if path == "":
                renderer.filepath = self.taskRootDir + "bld_rendering.png"
            else:
                if "." in path:
                    renderer.filepath = path
                else:
                    renderer.filepath = path + "bld_rendering.png"
        else:
            renderer.image_settings.file_format='JPEG'
            if path == "":
                renderer.filepath = self.taskRootDir + "bld_rendering.jpg"
            else:
                if "." in path:
                    renderer.filepath = path
                else:
                    renderer.filepath = path + "bld_rendering.jpg"
        sizes = self.resolution
        renderer.resolution_x = sizes[0]
        renderer.resolution_y = sizes[1]
class RenderingNode:
    __type__ = ''
    name = 'rnode'
    unit = 'm'
    routput = RenderingNodeOutput()
    renv = RenderingNodeEnv()
    rcamera = RenderingNodeCamera()
    rmaterials = []
    rootDir = ''
    taskRootDir = ''
    def __init__(self):
        self.__type__ = 'RenderingNode'
    def buildMaterialsJsonObj(self, mobjs):

        total = len(mobjs)
        for i in range(0, total):
            rnm = RenderingNodeMaterial()
            rnm.rootDir = self.rootDir
            rnm.taskRootDir = self.taskRootDir
            rnm.buildFromJsonObj(mobjs[i])
            self.rmaterials.append(rnm)
        print("self.rmaterials: ", self.rmaterials)

    def buildFromJsonObj(self, jsonObj):
        # print('RenderingNode::buildFromJsonObj() ..., ', jsonObj)
        # print('RenderingNode::buildFromJsonObj(), jsonObj["name"]:', jsonObj["name"])
        self.name = jsonObj['name']
        self.unit = jsonObj['unit']
        if 'output' in jsonObj:
           self.routput.rootDir = self.rootDir
           self.routput.taskRootDir = self.taskRootDir
           self.routput.buildFromJsonObj(jsonObj['output'])

        self.renv.bgTransparent = self.routput.bgTransparent
        if 'env' in jsonObj:
           self.renv.rootDir = self.rootDir
           self.renv.taskRootDir = self.taskRootDir
           self.renv.buildFromJsonObj(jsonObj['env'])
        if 'camera' in jsonObj:
           self.rcamera.taskRootDir = self.taskRootDir
           self.rcamera.buildFromJsonObj(jsonObj['camera'])
        if 'materials' in jsonObj:
           self.buildMaterialsJsonObj(jsonObj['materials'])
        # RenderingNodeMaterial

class RenderingTask:
    __type__ = ''
    name = ''
    taskID = 0
    times = 0
    rootDir = ''
    taskRootDir = ''
    rnode = RenderingNode()
    def __init__(self):
        self.__type__ = 'RenderingTask'

    def buildFromJsonObj(self, jsonObj):
        print('RenderingTask::buildFromJsonObj() ...')
        taskObj = jsonObj['task']
        self.name = taskObj['name']
        self.taskID = taskObj['taskID']
        self.times = taskObj['times']
        rnode = self.rnode
        rnode.rootDir = self.rootDir
        rnode.taskRootDir = self.taskRootDir
        rnode.buildFromJsonObj(taskObj['rnode'])

class RenderingCfg:
    name = ''
    taskRootDir = ''
    rootDir = ''
    configPath = ""
    configObj = {}
    # outputPath = ''
    # outputResolution = [1024, 1024]
    # bgTransparent = False

    rtask = RenderingTask()
    def __init__(self, root_path):
        self.taskRootDir = root_path
        #
    def setTaskRootDir(self, dir):
        self.taskRootDir = dir
        # os.path.exists(rootDir)
        self.rootDir = dir
        #
    def build(self):
        print("RenderingCfg::build() init ...")
        self.configPath = self.taskRootDir + "config.json"
        self.configObj = getJsonObjFromFile(self.configPath)
        cfg = self.configObj
        if "sys" in cfg:
            sysObj = cfg["sys"]
            self.rootDir = sysObj["rootDir"]

            # blend_file_path = bpy.data.filepath
            # print("### blend_file_path: ", blend_file_path)
            # directory = os.path.dirname(self.configPath)
            # # directory = self.configPath
            # filePathDir = os.path.join(directory, '../../')
            # print("### filePathDir: ", filePathDir)

            print("### self.rootDir: ", self.rootDir)
            #
        self.rtask.rootDir = self.rootDir
        self.rtask.taskRootDir = self.taskRootDir
        self.rtask.buildFromJsonObj(self.configObj)

    def getConfigData(self):
        print("getConfigData() init ...")
        self.configPath = self.taskRootDir + "config.json"
        self.configObj = getJsonObjFromFile(self.configPath)
        cfg = self.configObj
        taskObj = cfg["task"]
        self.outputPath = self.taskRootDir + taskObj["outputPath"]

        # if "bgTransparent" in taskObj:
        #     self.bgTransparent = taskObj["bgTransparent"] == 1
        #     print("XXXXXXX self.bgTransparent: ", self.bgTransparent)
        # if "outputResolution" in taskObj:
        #     self.outputResolution = taskObj["outputResolution"]
        ### get sys info
        if "sys" in cfg:
            sysObj = cfg["sys"]
            self.rootDir = sysObj["rootDir"]
            print("### self.rootDir: ", self.rootDir)
            #
        # print("getConfigData() self.configObj: ", self.configObj)
        #

sysRenderingCfg = RenderingCfg("")

def updateCamWithCfg(cfg):

    camNode = cfg.rtask.rnode.rcamera
    return camNode.apply()

def getSceneObjsBounds():
    print("getObjsBounds() init ...")

    minx, miny, minz = (999999.0,) * 3
    maxx, maxy, maxz = (-999999.0,) * 3
    mesh_objectDict = {}
    # create dict with meshes
    for m in bpy.data.meshes:
            mesh_objectDict[m.name] = []

    # sizeValue = 0
    # attach objects to dict keys
    for obj in bpy.context.scene.objects:
        # only for meshes
        if obj.type == 'MESH':
            # if this mesh exists in the dict
            if obj.data.name in mesh_objectDict:
                # print("getSceneObjsBounds() list(obj.bound_box[0]): ", list(obj.bound_box[0]), obj.dimensions)
                for v in obj.bound_box:
                    v_world = obj.matrix_world @ mathutils.Vector((v[0],v[1],v[2]))

                    if v_world[0] < minx:
                        minx = v_world[0]
                    if v_world[0] > maxx:
                        maxx = v_world[0]

                    if v_world[1] < miny:
                        miny = v_world[1]
                    if v_world[1] > maxy:
                        maxy = v_world[1]

                    if v_world[2] < minz:
                        minz = v_world[2]
                    if v_world[2] > maxz:
                        maxz = v_world[2]

    # for obj in meshObjs:
    #     # print("mesh obj: ", obj)
    #     print("mesh list(obj.bound_box[0]): ", list(obj.bound_box[0]), obj.dimensions)

    minV = (minx, miny, minz)
    maxV = (maxx, maxy, maxz)
    width = maxV[0] - minV[0]
    height = maxV[1] - minV[1]
    long = maxV[2] - minV[2]
    # print("minV: ", minV)
    # print("maxV: ", maxV)
    # print("width: ", width)
    # print("height: ", height)
    # print("long: ", long)
    print("getObjsBounds() end ...")

    # for debug
    # boundsUtils.createBoundsFrameBox(minV, maxV)
    return (minV,  maxV, (width, height, long))
###
def uniformScaleSceneObjs(dstSizeV):
    print("uniformScaleSceneObjs() init ...")
    boundsData = getSceneObjsBounds()
    sizeV = boundsData[2]

    # sx = dstSizeV[0] / sizeV[0]
    # sy = dstSizeV[1] / sizeV[1]

    if sizeV[0] > 0.0001:
        sx = dstSizeV[0] / sizeV[0]
    else:
        sx = 1.0
    if sizeV[1] > 0.0001:
        sy = dstSizeV[1] / sizeV[1]
    else:
        sy = 1.0
    if sizeV[2] > 0.0001:
        sz = dstSizeV[2] / sizeV[2]
    else:
        sz = 1.0
    # 等比缩放
    sx = sy = sz = min(sx, min(sy, sz))

    mesh_objectDict = {}
    # create dict with meshes
    for m in bpy.data.meshes:
        mesh_objectDict[m.name] = []

    # sizeValue = 0
    # attach objects to dict keys
    for obj in bpy.context.scene.objects:
        # only for meshes
        if obj.type == 'MESH':
            # if this mesh exists in the dict
            if obj.data.name in mesh_objectDict:
                location = obj.location
                location[0] *= sx
                location[1] *= sy
                location[2] *= sz
                obj.location = location
                scale = obj.scale
                scale[0] *= sx
                scale[1] *= sy
                scale[2] *= sz
                obj.scale = scale
                #
    print("uniformScaleSceneObjs() end ...")
    return True

taskRootDir = "D:/dev/webProj/"
# taskRootDir = "D:/dev/webdev/"

def clearAllMeshesInScene():
    bpy.ops.object.select_all(action='DESELECT')
    bpy.ops.object.select_by_type(type='MESH')
    bpy.ops.object.delete()
    #
def clearRawIScene():
    obj = bpy.data.objects["Cube"]
    if obj:
        bpy.data.objects.remove(obj)
    else:
        print("has not the default Cube object in the current scene.")
################################################################################

def loadAObjMesh(obj_file):
    # 加载OBJ模型
    imported_object = bpy.ops.import_scene.obj(filepath=obj_file)
    #
def loadAFbxMesh(fbx_file):
    # 加载FBX模型
    imported_object = bpy.ops.import_scene.fbx(filepath=fbx_file)
    #
def loadAGlbMesh(glb_file):
    # 加载glb模型
    imported_object = bpy.ops.import_scene.gltf(filepath=glb_file)
    #
def loadAUsdMesh(usd_file):
    # 加载usd模型
    imported_object = bpy.ops.wm.usd_import(filepath=usd_file)
    #

def loadAObjMeshFromCfg():
    cfgJson = sysRenderingCfg.configObj
    if "resource" in cfgJson:
        res = cfgJson["resource"]
        modelUrls = res["models"]
        url = modelUrls[0]
        print("model url: ", url)
        loadAObjMesh(url)
        return True
    else:
        print("has not mesh data ...")
    return False

def isBlendModelFile(index):

    global sysRenderingCfg
    cfgJson = sysRenderingCfg.configObj
    url = ""
    res = None
    resType = ""
    if "resources" in cfgJson:
        resList = cfgJson["resources"]
        res = resList[index]
        modelUrls = res["models"]
        url = modelUrls[0]

    elif "resource" in cfgJson:
        res = cfgJson["resource"]
        modelUrls = res["models"]
        url = modelUrls[0]
        # print("loadMeshAtFromCfg(), B model url: ", url)
    else:
        # print("has not mesh data ...")
        return False
    if (res is not None) and url != "":
        resType = res["type"] + ""
        # print("Fra:1 Model load begin ...")
        # sys.stdout.flush()
        if resType == "blend" or resType == "bld":
            return True

        # print("Fra:1 Model load end ...")
        # sys.stdout.flush()
        return False
    else:
        return False
    ################################################

def loadMeshAtFromCfg(index):
    global sysRenderingCfg
    cfgJson = sysRenderingCfg.configObj
    url = ""
    res = None
    resType = ""
    if "resources" in cfgJson:
        resList = cfgJson["resources"]
        res = resList[index]
        modelUrls = res["models"]
        url = sysRenderingCfg.taskRootDir + modelUrls[0]
        print("loadMeshAtFromCfg(), A model url: ", url)

    elif "resource" in cfgJson:
        res = cfgJson["resource"]
        modelUrls = res["models"]
        url = sysRenderingCfg.taskRootDir + modelUrls[0]
        # print("loadMeshAtFromCfg(), B model url: ", url)
    else:
        print("has not mesh data ...")
        return False
    if (res is not None) and url != "":

        resType = res["type"] + ""
        sys.stdout.flush()
        if resType == "obj":
            loadAObjMesh(url)
        elif resType == "fbx":
            loadAFbxMesh(url)
        elif resType == "glb":
            loadAGlbMesh(url)
        elif resType == "usdc":
            loadAUsdMesh(url)
        elif resType == "usdz":
            loadAUsdMesh(url)
        else:
            print("has not correct mesh data type ...")
            return False

        print("Fra:1 Model load end ...")
        sys.stdout.flush()
        return True
    else:
        return False

def objsFitToCamera():
    # Select objects that will be rendered
    for obj in context.scene.objects:
        obj.select_set(False)
    for obj in context.visible_objects:
        if not (obj.hide_get() or obj.hide_render):
            obj.select_set(True)
    #
    print("objsFitToCamera ops ...")
    bpy.ops.view3d.camera_to_view_selected()
    #

def load_handler(dummy):
    print("### Load Handler:", bpy.data.filepath)
    print("### Load dummy:", dummy)

bpy.app.handlers.load_post.append(load_handler)

def renderingExec():

    global sysRenderingCfg
    cfg = sysRenderingCfg
    beginTime = time.perf_counter()
    if not isBlendModelFile(0):
        clearAllMeshesInScene()
        loadMeshAtFromCfg(0)
    scaleFlag = uniformScaleSceneObjs((2.0, 2.0, 2.0))

    if not updateCamWithCfg(cfg):
        print("####### size auto fit camera ...")
        objsFitToCamera()

    lossTime = time.perf_counter() - beginTime

    print("####### modelRendering res ops lossTime: ", lossTime)
    # time.sleep(3.0)

    renv = cfg.rtask.rnode.renv
    renv.apply()

    # 设置设备类型为GPU
    beginTime = time.perf_counter()

    cyclesIns = bpy.context.scene.cycles
    cyclesIns.device = 'GPU'

    routput = cfg.rtask.rnode.routput
    routput.apply()
    imgW = routput.resolution[0]
    imgH = routput.resolution[1]

    bpy.context.scene.render.use_compositing = True
    cyclesIns.use_bvh_embree = True
    cyclesIns.use_denoising = True
    cyclesIns.denoising_store_passes = True
    print("####### modelRendering output resolution: ", imgW, imgW)
    if imgW > 256 and imgH > 256:
        cyclesIns.aa_samples = 128
        cyclesIns.samples = 512
    else:
        cyclesIns.aa_samples = 8
        cyclesIns.samples = 8
        cyclesIns.diffuse_bounces = 1
        cyclesIns.glossy_bounces = 1
        cyclesIns.max_bounces = 4

        # cyclesIns.preview_aa_samples = 2
        # cyclesIns.preview_samples = 2
        # cyclesIns.transmission_bounces = 2
        # cyclesIns.transparent_max_bounces = 2
        # print("mini rendering ...")

    # print("bpy.context.scene.cycles: ", bpy.context.scene.cycles)

    renderer = bpy.context.scene.render
    renderer.engine = 'CYCLES'
    # renderer.threads = 16

    #################################################################################

    bpy.ops.render.render(write_still=True)
    lossTime = time.perf_counter() - beginTime
    print("####### modelRendering rendering lossTime: ", lossTime)

def startupSys(argv):
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
		# print("sub0 argv: \n", argv)
        if len(argv) > 0:
            taskRootDir = argv[0].split("=")[1]
            print("taskRootDir: ", taskRootDir)
            sysRenderingCfg.setTaskRootDir(taskRootDir)
            sysRenderingCfg.build()
            # sysRenderingCfg.getConfigData()

            beginTime = time.perf_counter()
            renderingExec()
            lossTime = time.perf_counter() - beginTime
            print("####### modelRendering renderingExec ops lossTime: ", lossTime)
        else:
            argv = []
if __name__ == "__main__":
    # sys.stdout.write("modelRendering ######################### ...\n")
    print("Fra:1 modelRendering ######################### ...")
    print("Fra:1 modelRendering init ...")
    sys.stdout.flush()
    argv = sys.argv
    # print("modelRendering argv: \n", argv)
    startupSys(argv)
    # try:
    #     startupSys(argv)
    # except Exception as e:
    #     print("Error: rendering task has a error: ", e)
    # ### for test
    print("####### modelRendering end ...")
# D:\programs\blender\blender.exe -b -P .\modelRendering.py -- rtaskDir=D:/dev/webProj/voxblender/models/model01/
# D:\programs\blender\blender.exe -b -P .\modelRendering.py -- rtaskDir=D:/dev/webdev/minirsvr/src/renderingsvr/static/sceneres/v1ModelRTask2001/
# D:\programs\blender\blender.exe -b -P .\modelRendering.py -- rtaskDir=D:/dev/webProj/minirsvr/src/renderingsvr/static/sceneres/v1ModelRTask2001/
# D:\programs\blender\blender.exe -b -P .\modelRendering.py -- rtaskDir=D:/dev/webProj/voxserver/src/dsrdiffusion/static/assets/scene01/
# D:\programs\blender\blender.exe -b D:/dev/webProj/minirsvr/src/renderingsvr/static/sceneres/v1ModelRTask2003/scene01.blend -P .\modelRendering.py -- rtaskDir=D:/dev/webProj/minirsvr/src/renderingsvr/static/sceneres/v1ModelRTask2003/